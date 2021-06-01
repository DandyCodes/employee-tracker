const inquirer = require("inquirer");

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
  async selectManager(managers) {
    const answer = await inquirer.prompt({
      message: "SELECT MANAGER",
      type: "list",
      choices: managers.map(row => `${row.ID}|${row.Name}`),
      name: "choice",
      loop: false,
    });
    const manager = managers.find(e => e.ID == answer.choice.split("|")[0]);
    return manager;
  },
  async selectDepartment(departments) {
    const answer = await inquirer.prompt({
      message: "SELECT DEPARTMENT",
      type: "list",
      choices: departments.map(row => `${row.ID}|${row.Department}`),
      name: "choice",
      loop: false,
    });
    const department = departments.find(
      e => e.ID == answer.choice.split("|")[0]
    );
    return department;
  },
};
