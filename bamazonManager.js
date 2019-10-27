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
        if (err) console.log("Error is: ", err + "\n");
        console.log("Here is what we currently have in stock: \n\n");
        console.table(res);
        console.log("\n\n")
    });
    // console.log("This is the sql: \n\n", query.sql);
    listOptions(conn);
    // conn.end();
} //displayAllItems

function lowInventory(conn) {
    conn.query("Select * from products where stock_quantity < 5;", (err, res) => {
        if (err) console.log("Error is: ", err + "\n");
        console.table(res);
        console.log("\n\n")
    });
    listOptions(conn);
}

function addInventory(conn) {
    displayAllItems(conn);
    inquirer.prompt(
        [
            {
                name: "item",
                message: "What item would you like to add inventory to (enter item_id)?",
                type: "number",
                validate: (id) => {
                    if (id >= 1 && id <= 10) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                message: "How much additional quantity would you like to add?",
                type: "number"
            }
        ]
    ).then((ans) => {
        //getting original value which will be added to ans.quantity 
        conn.query("Select stock_quantity from products where ?;",
            [
                {
                    item_id: ans.item
                }
            ], (err, res) => {
                if (err) console.log("Error is: ", err + "\n");
                var orig = res[0].stock_quantity;
                if (orig) {
                    conn.query("UPDATE products SET ? where ?;",
                        [
                            {
                                stock_quantity: parseInt(orig) + parseInt(ans.quantity)
                            },
                            {
                                item_id: ans.item
                            }
                        ],
                        (err, res) => {
                            if (err) console.log("Error is: ", err + "\n");
                            else console.log(res.affectedRows + " products updated!\n\n");
                        });
                }
            });
        displayAllItems(conn);
    });
}
