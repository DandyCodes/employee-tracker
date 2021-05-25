const inquirer = require("inquirer");

module.exports = {
    async whatDoYouWantToDo() {
        const answer = await inquirer.prompt({
            message: "What do you want to do?",
            type: "list",
            choices: ["View all employees", "Quit"],
            name: "action",
        });
        return answer.action;
    },
    async continue() {
        const answer = await inquirer.prompt({
            message: "Press ENTER to continue",
            type: "input",
            name: "name",
        });
    },
};
