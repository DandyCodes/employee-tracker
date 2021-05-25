require("dotenv").config();
const db = require("mysql2/promise");
const ask = require("./dist/ask");

async function main() {
    const connection = await db.createConnection({
        host: process.env.HOST,
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        database: "employee_db",
    });
    let action = await ask.whatDoYouWantToDo();
    while (action !== "Quit") {
        switch (action) {
            case "View all employees":
                console.log("emp");
                break;
        }
        action = await ask.continue();
        action = await ask.whatDoYouWantToDo();
    }
    connection.end();
}

main();
