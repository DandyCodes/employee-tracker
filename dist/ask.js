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
};
