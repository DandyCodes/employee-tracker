require("console.table");
const query = require("./query");
const pluralize = require("pluralize");
const display = require("./display");

module.exports = {
  config(dbConnection) {
    query.config(dbConnection);
  },
  async viewAll(tableName) {
    const rows = await query.getAll(tableName);
    for (const row of rows) {
      for (const key in row) {
        if (key.endsWith("_id")) {
          const id = row[key];
          const niceKey = key.replace("_id", "");
          const foreignTableName =
            niceKey == "manager" ? "employees" : pluralize(niceKey);
          row[niceKey] = await query.getRowNameById(foreignTableName, id);
          delete row[key];
        }
      }
    }
    display(rows, tableName);
  },
  async viewEmployeesByManager() {},
  async viewTheTotalUtilizedBudgetOfADepartment() {},
  async updateEmployeeRole() {},
  async updateEmployeeManager() {},
  async addDepartment() {},
  async addRole() {},
  async addEmployee() {},
  async deleteDepartment() {},
  async deleteRole() {},
  async deleteEmployee() {},
  async quit() {
    process.exit();
  },
};
