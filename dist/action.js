require("console.table");
const ask = require("./ask");
const query = require("./query");
const getQueries = new Map([
  ["EMPLOYEES", query.getEmployees],
  ["ROLES", query.getRoles],
  ["DEPARTMENTS", query.getDepartments],
]);

module.exports = {
  async config(dbConnection) {
    query.config(dbConnection);
  },
  async view() {
    const choices = [
      "EMPLOYEES",
      "ROLES",
      "DEPARTMENTS",
      "EMPLOYEES BY MANAGER",
      "THE TOTAL UTILIZED BUDGET OF A DEPARTMENT",
    ];
    const choice = await ask.chooseFrom(choices, "VIEW");
    const viewAction =
      choice == "EMPLOYEES BY MANAGER"
        ? viewEmployeesByManager
        : choice == "THE TOTAL UTILIZED BUDGET OF A DEPARTMENT"
        ? viewTheTotalUtilizedBudgetOfADepartment
        : viewAll;
    await viewAction(choice);
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
    await getQueries.updateColumnValue(
      "employees",
      columnName,
      chosenRow ? chosenRow.id : null,
      employee.id
    );
    const updatedEmployee = await getQueries.getRowById(
      "employees",
      employee.id
    );
    await display([updatedEmployee], "employees");
  },
  async add() {
    const choices = getQueries.concat().map(choice => choice.toUpperCase());
    const choice = await ask.chooseFrom(choices, `ADD`);
    const tableName = choice.toLowerCase();
    const allColumnNamesOfTable = await getQueries.getColumnNames(tableName);
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
    await getQueries.addRow(tableName, columnsToUpdate, values);
    const rows = await getQueries.getAllRows(tableName);
    await display(rows, tableName);
  },
  async remove() {
    const choices = getQueries.concat().map(choice => choice.toUpperCase());
    const choice = await ask.chooseFrom(choices, `REMOVE`);
    const tableName = choice.toLowerCase();
    const rowToDelete = await askSelectRow(
      tableName,
      `REMOVE ${tableName.toUpperCase()}`
    );
    await getQueries.removeRowById(tableName, rowToDelete.id);
    const rows = await getQueries.getAllRows(tableName);
    const message = await display(rows, tableName);
    if (message) console.log(message);
  },
  async quit() {
    process.exit();
  },
};

async function viewAll(choice) {
  const getQuery = getQueries.get(choice);
  const rows = await getQuery();
  console.table(rows);
}

async function viewEmployeesByManager() {
  const managers = await query.getManagers();
  const manager = await ask.selectManager(managers);
  console.log("\n");
  console.log("MANAGER");
  console.table([manager]);
  const employees = await query.getEmployeesByManager(manager);
  console.log("MANAGED EMPLOYEES");
  console.table(employees);
}

async function viewTheTotalUtilizedBudgetOfADepartment() {
  const departments = await query.getDepartments();
  const department = await ask.selectDepartment(departments);
  const employees = await query.getEmployeesByDepartment(department);
  console.table(employees);
  const totalBudget = employees.reduce(
    (acc, cur) => acc + Number(cur.Salary),
    0
  );
  console.log(
    `Total Utilized Budget of ${department.Department}:`,
    totalBudget
  );
}
