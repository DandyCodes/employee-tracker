require("console.table");
const ask = require("./ask");
const query = require("./query");
const display = require("./display");
let tableNames;

module.exports = {
  async config(dbConnection) {
    query.config(dbConnection);
    tableNames = await query.getTableNames();
  },
  async view() {
    const choices = tableNames
      .concat(
        "EMPLOYEES BY MANAGER",
        "THE TOTAL UTILIZED BUDGET OF A DEPARTMENT"
      )
      .map(choice => choice.toUpperCase());
    const choice = await ask.chooseFrom(choices);
    const viewAction =
      choice == "EMPLOYEES BY MANAGER"
        ? viewEmployeesByManager
        : choice == "THE TOTAL UTILIZED BUDGET OF A DEPARTMENT"
        ? viewTheTotalUtilizedBudgetOfADepartment
        : viewAll;
    await viewAction(choice.toLowerCase());
  },
  async update() {
    const employee = await askSelectRow("employees", "UPDATE");
    await display(
      [employee],
      `UPDATE ${employee.first_name} ${employee.last_name}`
    );
    const choices = ["ROLE", "MANAGER"];
    const choice = await ask.chooseFrom(
      choices,
      `UPDATE ${employee.first_name} ${employee.last_name}`
    );
    const tableName = choice == "MANAGER" ? "employees" : "roles";
    const chosenRow = await askSelectRow(tableName, `CHOOSE ${choice}`);
    if (choice === "MANAGER" && chosenRow && chosenRow.id === employee.id) {
      console.log("Cannot select self");
      return;
    }
    const columnName = `${choice.toLowerCase()}_id`;
    await query.updateColumnValue(
      "employees",
      columnName,
      chosenRow ? chosenRow.id : null,
      employee.id
    );
    const updatedEmployee = await query.getRowById("employees", employee.id);
    await display([updatedEmployee], "employees");
  },
  async add() {
    const choices = tableNames.concat().map(choice => choice.toUpperCase());
    const choice = await ask.chooseFrom(choices, `ADD`);
    const tableName = choice.toLowerCase();
    const allColumnNamesOfTable = await query.getColumnNames(tableName);
    const newRow = {};
    for (const columnName of allColumnNamesOfTable) {
      if (columnName === "role_id") {
        const role = await askSelectRow("roles", "CHOOSE ROLE");
        newRow[columnName] = role.id;
        continue;
      }
      if (columnName === "manager_id") {
        const manager = await askSelectRow("employees", "CHOOSE MANAGER");
        if (manager) {
          newRow[columnName] = manager.id;
        }
        continue;
      }
      if (columnName === "department_id") {
        const department = await askSelectRow(
          "departments",
          "CHOOSE DEPARTMENT"
        );
        newRow[columnName] = department.id;
        continue;
      }
      const input = await ask.input(`${columnName.toUpperCase()}`);
      newRow[columnName] = input;
    }
    const columnsToUpdate = [];
    const values = [];
    for (const key in newRow) {
      columnsToUpdate.push(key);
      values.push(newRow[key]);
    }
    await query.addRow(tableName, columnsToUpdate, values);
    const rows = await query.getAllRows(tableName);
    await display(rows, tableName);
  },
  async remove() {
    const choices = tableNames.concat().map(choice => choice.toUpperCase());
    const choice = await ask.chooseFrom(choices, `REMOVE`);
    const tableName = choice.toLowerCase();
    const rowToDelete = await askSelectRow(
      tableName,
      `REMOVE ${tableName.toUpperCase()}`
    );
    await query.removeRowById(tableName, rowToDelete.id);
    const rows = await query.getAllRows(tableName);
    const message = await display(rows, tableName);
    if (message) console.log(message);
  },
  async quit() {
    process.exit();
  },
};

async function askSelectRow(tableName, message) {
  const rows = await query.getAllRows(tableName);
  const idsAndNames = [];
  for (const row of rows) {
    const name = await query.getNiceIdentifierFromID(tableName, row.id);
    idsAndNames.push(`${row.id}|${name}`);
  }
  if (message === `CHOOSE MANAGER`) {
    idsAndNames.push("NONE");
  }
  const chosenIdAndName = await ask.chooseFrom(idsAndNames, message);
  if (chosenIdAndName === "NONE") {
    return null;
  }
  const chosenId = chosenIdAndName.split("|")[0];
  const selectedRow = await query.getRowById(tableName, chosenId);
  return selectedRow;
}

async function viewAll(tableName) {
  const rows = await query.getAllRows(tableName);
  await display(rows, tableName);
}

async function viewEmployeesByManager() {
  const employees = await query.getAllRows("employees");
  const managerIds = [];
  for (const employee of employees) {
    if (!employee.manager_id) continue;
    if (!managerIds.includes(employee.manager_id)) {
      managerIds.push(employee.manager_id);
    }
  }
  const managerIdsAndNames = [];
  for (const managerId of managerIds) {
    const managerName = await query.getNiceIdentifierFromID(
      "employees",
      managerId
    );
    managerIdsAndNames.push(`${managerId}|${managerName}`);
  }
  const chosenManagerIdAndName = await ask.chooseFrom(
    managerIdsAndNames,
    `CHOOSE MANAGER`
  );
  const chosenManagerId = chosenManagerIdAndName.split("|")[0];
  const managedEmployees = [];
  for (const employee of employees) {
    if (employee.manager_id == chosenManagerId) {
      managedEmployees.push(employee);
    }
  }
  const chosenManagerName = chosenManagerIdAndName.split("|")[1];
  await display(managedEmployees, `EMPLOYEES MANAGED BY ${chosenManagerName}`);
}

async function viewTheTotalUtilizedBudgetOfADepartment() {
  console.log("budget");
}
