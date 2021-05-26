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
  console.clear();
  await ask.welcome();
  console.log("\n");
  while (true) {
    const actions = [
      "View departments",
      "View roles",
      "View employees",
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
    await action[camelCase(choice)](connection);
    await ask.pressEnter();
  }
}

main();
