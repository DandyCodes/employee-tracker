require("console.table");
const ask = require("./ask");
const query = require("./query");
const queries = new Map([
  ["employees", query.getEmployees],
  ["roles", query.getRoles],
  ["departments", query.getDepartments],
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
    const employee = await ask.selectFromTable("employees");
    const choices = ["ROLE", "MANAGER"];
    const choice = await ask.chooseFrom(choices, `UPDATE ${employee.Name}`);
    const updateAction = choice == "ROLE" ? updateRole : updateManager;
    await updateAction(employee);
  },
  async add() {
    const choices = ["EMPLOYEE", "ROLE", "DEPEARTMENT"];
    const choice = await ask.chooseFrom(choices, "ADD");
    const addAction =
      choice == "EMPLOYEE"
        ? addEmployee
        : choice == "ROLE"
        ? addRole
        : addDepartment;
    await addAction();
  },
  async remove() {
    const choices = ["EMPLOYEE", "ROLE", "DEPARTMENT"];
    const choice = await ask.chooseFrom(choices, "REMOVE");
    const tableName = getTableName(choice);
    const selectedRow = await ask.selectFromTable(tableName);
    const errorMessage = await query.removeRow(selectedRow.ID, tableName);
    if (errorMessage.sqlMessage) {
      console.log(errorMessage.sqlMessage);
    } else {
      const getQuery = queries.get(tableName);
      const updatedRows = await getQuery();
      console.table(updatedRows);
    }
  },
  async quit() {
    process.exit();
  },
};

async function viewAll(choice) {
  const tableName = getTableName(choice);
  const getQuery = queries.get(tableName);
  const rows = await getQuery();
  console.table(rows);
}

async function viewEmployeesByManager() {
  const managers = await query.getManagers();
  const manager = await ask.selectFromEmployeeRows(managers, "SELECT MANAGER");
  console.log("\n");
  console.log("MANAGER");
  console.table([manager]);
  const employees = await query.getEmployeesByManager(manager);
  console.log("MANAGED EMPLOYEES");
  console.table(employees);
}

async function viewTheTotalUtilizedBudgetOfADepartment() {
  const department = await ask.selectFromTable("departments");
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

async function updateRole(employee) {
  const role = await ask.selectFromTable("roles");
  await query.updateRole(employee, role);
  const updatedEmployees = await query.getEmployees();
  console.table(updatedEmployees);
}

async function updateManager(employee) {
  const potentialManagers = (await query.getEmployees()).filter(
    potentialManager => potentialManager.ID != employee.ID
  );
  potentialManagers.push({ Name: "NONE", ID: "" });
  const newManager = await ask.selectFromEmployeeRows(
    potentialManagers,
    "SELECT MANAGER"
  );
  await query.updateManager(employee, newManager);
  const updatedEmployees = await query.getEmployees();
  console.table(updatedEmployees);
}

async function addEmployee() {
  const firstName = await ask.input("First Name");
  const lastName = await ask.input("Last Name");
  const role = await ask.selectFromTable("roles");
  const potentialManagers = await query.getEmployees();
  potentialManagers.push({ Name: "NONE", ID: "" });
  const manager = await ask.selectFromEmployeeRows(
    potentialManagers,
    "SELECT MANAGER"
  );
  await query.addEmployee(firstName, lastName, role, manager);
  const updatedEmployees = await query.getEmployees();
  console.table(updatedEmployees);
}

async function addRole() {
  const title = await ask.input("Title");
  const salary = await ask.input("Salary");
  if (Number.isNaN(Number(salary))) {
    console.log("Salary must be a number");
    return;
  }
  const department = await ask.selectFromTable("departments");
  await query.addRole(title, salary, department);
  const updatedRoles = await query.getRoles();
  console.table(updatedRoles);
}

async function addDepartment() {
  const name = await ask.input("Name");
  await query.addDepartment(name);
  const updatedDepartments = await query.getDepartments();
  console.table(updatedDepartments);
}

function getTableName(choice) {
  choice = choice.replace("S", "");
  return choice == "EMPLOYEE"
    ? "employees"
    : choice == "ROLE"
    ? "roles"
    : "departments";
}
