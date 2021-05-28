require("dotenv").config();
const db = require("mysql2/promise");
const ask = require("./dist/ask");
const actions = require("./dist/actions");

async function main() {
  const connection = await db.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: "employee_db",
  });
  await actions.config(connection);
  console.clear();
  await ask.welcome();
  console.log("\n");
  while (true) {
    const choices = ["VIEW", "UPDATE", "ADD", "REMOVE", "QUIT"];
    const choice = (
      await ask.chooseFrom(choices, "SELECT AN ACTION")
    ).toLowerCase();
    await actions[choice]();
    await ask.pressEnter();
  }
}

main();
