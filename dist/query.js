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
  async updateRole(employee, role) {
    return (
      await connection.query(
        `UPDATE employees SET role_id=${role.ID} WHERE employees.id=${employee.ID}`
      )
    )[0];
  },
  async updateManager(employee, newManager) {
    const newManagerId = newManager.ID ? newManager.ID : null;
    return (
      await connection.query(
        `UPDATE employees SET manager_id=${newManagerId} WHERE employees.id=${employee.ID}`
      )
    )[0];
  },
  async addEmployee(firstName, lastName, role, manager) {
    const managerId = manager.ID ? manager.ID : null;
    return (
      await connection.query(
        `INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES ("${firstName}","${lastName}",${role.ID},${managerId})`
      )
    )[0];
  },
  async addRole(title, salary, department) {
    return (
      await connection.query(
        `INSERT INTO roles (title,salary,department_id) VALUES ("${title}",${salary},${department.ID})`
      )
    )[0];
  },
  async addDepartment(name) {
    return (
      await connection.query(
        `INSERT INTO departments (name) VALUES ("${name}")`
      )
    )[0];
  },
  async removeRow(id, tableName) {
    try {
      return (
        await connection.query(`DELETE FROM ${tableName} WHERE id=${id}`)
      )[0];
    } catch (error) {
      return error;
    }
  },
};
