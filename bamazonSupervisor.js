var mysql = require("mysql");
var inquirer = require("inquirer");
var Password = require("./passwordPrompt");

new Password().getPassword(loginCallback); // main/entry-point

function loginCallback(password) {
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: password,
        database: "bamazon_db"
    });

    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        // connection.end();
        supervisorChoices(conn);
    });
} //loginCallback

function supervisorChoices(conn) {
    inquirer.prompt(
        [
            {
                name: "choice",
                message: "Hello supervisor, what would you like to do?",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"]
            }
        ]
    ).then((ans) => {
        switch (ans.choice) {
            case "View Product Sales by Department":
                //viewSales(conn);
                break;
            case "Create New Department":
                //newDept(conn)
                break;
            default:
                conn.end();
                process.exit(0);
        }
    })
}
