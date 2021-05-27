require("dotenv").config();
const db = require("mysql2/promise");
const ask = require("./dist/ask");
const action = require("./dist/action");
const camelCase = require("camelcase");
const fs = require("fs");

async function main() {
  const connection = await db.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: "employee_db",
  });
  action.config(connection);
  console.clear();
  await ask.welcome();
  console.log("\n");
  while (true) {
    const actions = [
      "View all departments",
      "View all roles",
      "View all employees",
      "View employees by manager",
      "View the total utilized budget of a department",
      "Update employee role",
      "Update employee manager",
      "Add department",
      "Add role",
      "Add employee",
      "Delete department",
      "Delete role",
      "Delete employee",
      "Quit",
    ];
    const choice = await ask.chooseFrom(actions, "SELECT AN ACTION");
    if (choice.startsWith("View all ")) {
      const tableName = choice.trim().split(" ").pop();
      await action.viewAll(tableName);
    }
    // calls a method on the action export object
    // await action[camelCase(choice)]();
    await ask.pressEnter();
  }
}

main();
