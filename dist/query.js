let connection;

module.exports = {
  config(dbConnection) {
    connection = dbConnection;
  },
  async getEmployees() {
    return (
      await connection.query(
        `SELECT employees.id as ID, CONCAT(employees.first_name," ", employees.last_name) as Name, roles.title as Role, roles.salary as Salary, departments.name as Department, CONCAT(managers.first_name," ", managers.last_name) as Manager FROM employees LEFT JOIN roles ON employees.role_id=roles.id LEFT JOIN departments ON roles.department_id=departments.id LEFT JOIN employees managers ON employees.manager_id=managers.id`
      )
    )[0];
  },
  async getRoles() {
    return (
      await connection.query(
        `SELECT roles.id as ID, roles.title as Role, roles.salary as Salary, departments.name as Department FROM roles JOIN departments ON roles.department_id = departments.id`
      )
    )[0];
  },
  async getDepartments() {
    return (
      await connection.query(
        `SELECT id as ID, name as Department FROM departments`
      )
    )[0];
  },
  async getManagers() {
    return (
      await connection.query(
        `SELECT employees.id as ID, CONCAT(employees.first_name," ", employees.last_name) as Name, roles.title as Role, roles.salary as Salary, departments.name as Department, CONCAT(managers.first_name," ", managers.last_name) as Manager FROM employees LEFT JOIN roles ON employees.role_id=roles.id LEFT JOIN departments ON roles.department_id=departments.id LEFT JOIN employees managers ON managers.id=employees.manager_id WHERE EXISTS (SELECT employees.id FROM employees as managed_employees WHERE managed_employees.manager_id = employees.id)`
      )
    )[0];
  },
  async getEmployeesByManager(manager) {
    return (
      await connection.query(
        `SELECT CONCAT(employees.first_name," ", employees.last_name) as Name, roles.title as Role, roles.salary as Salary, departments.name as Department FROM employees JOIN roles ON employees.role_id = roles.id AND employees.manager_id=${manager.ID} JOIN departments ON roles.department_id = departments.id`
      )
    )[0];
  },
  async getEmployeesByDepartment(department) {
    return (
      await connection.query(
        `SELECT departments.name as Department, CONCAT(employees.first_name," ", employees.last_name) as Name, roles.title as Role, roles.salary as Salary FROM employees INNER JOIN roles ON roles.department_id=${department.ID} AND employees.role_id=roles.id JOIN departments ON departments.id=${department.ID}`
      )
    )[0];
  },
};
