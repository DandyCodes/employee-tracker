require("dotenv").config();
require("console.table");
const inquirer = require("inquirer");
const db = require("mysql2/promise");
let connection;

async function welcome() {
  await inquirer.prompt({
    message: `
.--------------------------------------.
|              WELCOME TO              |
|           EMPLOYEE TRACKER           |
|         Press Enter To Begin         |
'--------------------------------------'`,
    type: "input",
    name: "name",
  });
}

async function pressEnter() {
  await inquirer.prompt({
    message: "Press ENTER to continue",
    type: "input",
    name: "name",
  });
}

async function choose(message, choices) {
  const answer = await inquirer.prompt({
    message: message,
    type: "list",
    choices: choices,
    name: "choice",
  });
  return answer.choice;
}

async function input(message) {
  const answer = await inquirer.prompt({
    message: message,
    type: "input",
    name: "input",
  });
  return answer.input;
}

async function budget() {
  const departments = getAll("departments");
  const department = await ask.department(departments);
}

async function getAll(tableName) {
  return (await connection.query(`SELECT * FROM ${tableName}`))[0];
}

function getCommaSeparatedColumnNames(columns) {
  const columnNames = [];
  for (const column of columns) {
    if (column.Key != "PRI") {
      columnNames.push(column.Field);
    }
  }
  return columnNames;
}

async function getColumnValues(columns) {
  let values = [];
  for (const column of columns) {
    if (column.Key != "PRI") {
      values.push(await input(column.Field));
    }
  }
  values = values.map(value =>
    Number.isNaN(Number(value)) ? `"${value}"` : Number(value)
  );
  return values;
}

async function getEmployeeFullNames() {
  return (await getAll("Employees")).map(
    employee => `${employee.first_name} ${employee.last_name}`
  );
}

async function VIEW(tableNameTitleCase) {
  const tableName = tableNameTitleCase.toLowerCase();
  const rows = await getAll(tableName);
  console.log("\n", "\t", tableName.toUpperCase(), "\n");
  console.table(rows);
}

async function ADD(tableNameTitleCase) {
  const tableName = tableNameTitleCase.toLowerCase();
  const columns = (await connection.query(`DESC ${tableName}`))[0];
  const csColumnNames = getCommaSeparatedColumnNames(columns);
  const values = await getColumnValues(columns);
  const csv = values.join(",");
  await connection.query(
    `INSERT INTO ${tableName} (${csColumnNames}) VALUES (${values})`
  );
  await VIEW(tableName);
}

async function UPDATE(spaceDelimitedEmployeeFullName) {
  const names = spaceDelimitedEmployeeFullName.split(" ");
  const employee = (
    await connection.query(
      `SELECT * FROM Employees WHERE first_name="${names[0]}" AND last_name="${names[1]}"`
    )
  )[0];
  const displayName = spaceDelimitedEmployeeFullName.toUpperCase();
  console.log("\n", "\t", spaceDelimitedEmployeeFullName.toUpperCase(), "\n");
  console.table(employee);
  const column = await choose(`UPDATE ${displayName}`, ["Role", "Manager"]);
  while (true) {
    const newValue = await input(`Enter new ${column} for ${displayName}`);
    if (Number.isInteger(Number(newValue))) break;
    console.log("Must be an integer");
  }
  const modifiedEmployee = (
    await connection.query(
      `SELECT * FROM Employees WHERE first_name="${names[0]}" AND last_name="${names[1]}"`
    )
  )[0];
  console.log("\n", "\t", spaceDelimitedEmployeeFullName.toUpperCase(), "\n");
  console.table(modifiedEmployee);
}

async function DELETE(tableName) {}

async function main() {
  connection = await db.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: "employee_db",
  });
  console.clear();
  await welcome();

  const actions = ["VIEW", "ADD", "UPDATE", "DELETE"];
  const tables = ["Departments", "Roles", "Employees"];

  while (true) {
    const action = await choose("Select action", actions.concat(["QUIT"]));
    if (action == "QUIT") {
      break;
    }
    const choices =
      action == "VIEW"
        ? ["Total Utilized Budget of A Department"].concat(tables)
        : action == "UPDATE"
        ? await getEmployeeFullNames()
        : tables;
    const choice = await choose(action, choices.concat(["CANCEL"]));
    if (choice == "CANCEL") continue;
    await eval(action)(choice);
    await pressEnter();
    console.log("\n");
  }
  connection.end();
}

main();

function titleCase(originalString) {
  const words = originalString.split("_");
  let titleCaseString = "";
  for (const word of words) {
    const wordArray = word.split("");
    wordArray[0] = wordArray[0].toUpperCase();
    titleCaseString += wordArray.join("") + " ";
  }
  return titleCaseString.trim();
}
