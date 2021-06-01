const inquirer = require("inquirer");
const query = require("./query");
const queries = new Map([
  ["employees", query.getEmployees],
  ["roles", query.getRoles],
  ["departments", query.getDepartments],
]);
const identifyingKeys = new Map([
  ["employees", "Name"],
  ["roles", "Role"],
  ["departments", "Department"],
]);

module.exports = {
  async welcome() {
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
  },
  async pressEnter() {
    await inquirer.prompt({
      message: "Press ENTER to continue",
      type: "input",
      name: "name",
    });
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    console.log("\n");
  },
  async chooseFrom(choices, message) {
    const answer = await inquirer.prompt({
      message: message,
      type: "list",
      choices: choices,
      name: "choice",
      loop: false,
    });
    return answer.choice;
  },
  async input(message) {
    const answer = await inquirer.prompt({
      message: message,
      type: "input",
      name: "input",
    });
    return answer.input;
  },
  async selectFromEmployeeRows(employees, message) {
    const answer = await inquirer.prompt({
      message: message,
      type: "list",
      choices: employees.map(row => `${row.ID}|${row.Name}`),
      name: "choice",
      loop: false,
    });
    const employee = getChoice(answer, employees);
    return employee;
  },
  async selectFromTable(tableName) {
    const getQuery = queries.get(tableName);
    const choices = await getQuery();
    const message = `SELECT ${tableName.replace("s", "").toUpperCase()}`;
    const identifyingKey = identifyingKeys.get(tableName);
    const answer = await inquirer.prompt({
      message: message,
      type: "list",
      choices: choices.map(row => `${row.ID}|${row[identifyingKey]}`),
      name: "choice",
      loop: false,
    });
    const choice = getChoice(answer, choices);
    return choice;
  },
};

function getChoice(answer, choices) {
  return choices.find(e => e.ID == answer.choice.split("|")[0]);
}
