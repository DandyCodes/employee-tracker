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

async function getEmployeeNames() {
  return (await getAll("employees")).map(
    employee => `${employee.first_name} ${employee.last_name}`
  );
}

async function VIEW(tableName) {
  const rows = await getAll(tableName);
  console.log("\n", "\t", tableName.toUpperCase(), "\n");
  console.table(rows);
}

async function ADD(tableName) {
  const columns = (await connection.query(`DESC ${tableName}`))[0];
  const csColumnNames = getCommaSeparatedColumnNames(columns);
  const values = await getColumnValues(columns);
  const csv = values.join(",");
  await connection.query(
    `INSERT INTO ${tableName} (${csColumnNames}) VALUES (${values})`
  );
  await VIEW(tableName);
}

async function UPDATE(employee) {}

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
        ? await getEmployeeNames()
        : tables;
    const choice = await choose(action, choices.concat(["CANCEL"]));
    if (choice == "CANCEL") continue;
    await eval(action)(choice.toLowerCase());
    await pressEnter();
    console.log("\n");
  }
  connection.end();
}

main();
