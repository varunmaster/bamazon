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
        listOptions(connection);
    });
} //loginCallback

function listOptions(conn) {
    inquirer.prompt(
        [
            {
                name: "managerOption",
                message: "Hello Manager, what would you like to do?",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ]
    ).then((ans) => {
        switch (ans.managerOption) {
            case "View Products for Sale":
                viewProducts(conn);
                break;
            case "View Low Inventory":
                lowInventory(conn);
                break;
            case "Add to Inventory":
                addInventory(conn);
                break;
            case "Add New Product":
                newProduct(conn);
                break;
            default:
                process.exit(0);
        }
    });
}


