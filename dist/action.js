require("console.table");
const display = require("./display");

module.exports = {
  async viewDepartments(connection) {
    const departments = (
      await connection.query(`SELECT * FROM departments`)
    )[0];
    console.log("\n", "\t", "DEPARTMENTS", "\n");
    display(departments);
  },
  async viewRoles(connection) {
    const roles = (await connection.query(`SELECT * FROM roles`))[0];
    console.log("\n", "\t", "ROLES", "\n");
    display(roles);
  },
  async viewEmployees(connection) {
    const employees = (await connection.query(`SELECT * FROM employees`))[0];
    console.log("\n", "\t", "EMPLOYEES", "\n");
    display(employees);
  },
  async viewEmployeesByManager(connection) {},
  async viewTheTotalUtilizedBudgetOfADepartment(connection) {},
  async updateEmployeeRole(connection) {},
  async updateEmployeeManager(connection) {},
  async addDepartment(connection) {},
  async addRole(connection) {},
  async addEmployee(connection) {},
  async deleteDepartment(connection) {},
  async deleteRole(connection) {},
  async deleteEmployee(connection) {},
  async quit(_connection) {
    process.exit();
  },
};
