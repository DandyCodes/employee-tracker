require("dotenv").config();
const db = require("mysql2/promise");
const ask = require("./dist/ask");
const action = require("./dist/action");
const userActions = new Map([
  ["VIEW", action.view],
  ["UPDATE", action.update],
  ["ADD", action.add],
  ["REMOVE", action.remove],
  ["QUIT", action.quit],
]);

async function main() {
  const connection = await db.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  await action.config(connection);
  console.clear();
  await ask.welcome();
  console.log("\n");
  while (true) {
    const choices = ["VIEW", "UPDATE", "ADD", "REMOVE", "QUIT"];
    const choice = await ask.chooseFrom(choices, "SELECT AN ACTION");
    const userAction = userActions.get(choice);
    await userAction();
    await ask.pressEnter();
  }
}

main();
