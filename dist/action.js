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
    for (const role of roles) {
      const department = (
        await connection.query(
          `SELECT * FROM departments WHERE id=${role.department_id}`
        )
      )[0][0];
      role.department_id = department.name;
    }
    console.log("\n", "\t", "ROLES", "\n");
    display(roles);
  },
  async viewEmployees(connection) {
    const employees = (await connection.query(`SELECT * FROM employees`))[0];
    for (const employee of employees) {
      const role = (
        await connection.query(
          `SELECT * FROM roles WHERE id=${employee.role_id}`
        )
      )[0][0];
      employee.role_id = role.title;
      if (employee.manager_id !== null) {
        const manager = (
          await connection.query(
            `SELECT * FROM employees WHERE id=${employee.manager_id}`
          )
        )[0][0];
        employee.manager_id = manager.first_name + " " + manager.last_name;
      }
    }
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
