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
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
            }
        ]
    ).then((ans) => {
        switch (ans.managerOption) {
            case "View Products for Sale":
                displayAllItems(conn);
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

function displayAllItems(conn) {
    conn.query("Select * from products;", (err, res) => {
        if (err) console.log("Error is: ", err);
        console.log("Here is what we currently have in stock: \n");
        console.table(res);
    });
    // console.log("This is the sql: \n\n", query.sql);
    listOptions(conn);
    // conn.end();
} //displayAllItems

function lowInventory(conn) {
    conn.query("Select * from products where stock_quantity < 5;", (err, res) => {
        if (err) console.log("Error is: ", err);
        console.table(res);
    });
    listOptions(conn);
}
