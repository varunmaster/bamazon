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
        displayAllItems(connection);
    });
} //loginCallback

function displayAllItems(conn) {
    conn.query("Select * from products;", (err, res) => {
        if (err) console.log("Error is: ", err);
        console.log("Here is what we currently have in stock: \n");
        console.table(res);
    });
    // console.log("This is the sql: \n\n", query.sql);
    displayChoices(conn);
    // conn.end();
} //displayAllItems

function displayChoices(conn) {
    inquirer.prompt(
        [
            {
                name: "userChoice",
                message: "What would you like to do?",
                type: "list",
                choices: ["Buy something", "Exit"]
            }
        ]
    ).then((ans) => {
        if(ans.userChoice === "Buy something") askCustomer(conn);
        else {
            conn.end(); 
            process.exit(0);
        }
    });
}

function askCustomer(conn) {
    inquirer.prompt(
        [
            {
                name: "prodID",
                message: "What product would you like to buy (enter item_id)?",
                type: "input",
                validate: (id) => {
                    if (id >= 1 && id <= 10) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "userQuantity",
                message: "Please enter the amount of item",
                type: "input"
            }
        ]
    ).then((ans) => {
        //retrieving the original quantity to be reduced by the user amount
        conn.query("Select stock_quantity from products where ?;",
            [
                {
                    item_id: ans.prodID
                }
            ], (err, res) => {
                if (err) console.log("Error is: ", err);
                var orig = res[0].stock_quantity;
                if (parseInt(orig) >= parseInt(ans.userQuantity)) { //if the original value in the DB is greater than userAmt, then update the db, otherwise throw insufficient quant
                    conn.query("Select stock_quantity from products where ?;",
                        [
                            {
                                item_id: ans.prodID
                            }
                        ], (err, res) => {
                            if (err) console.log("Error is: ", err);
                            var orig = res[0].stock_quantity; //IMPORTANT: need this to retrieve just the VALUE of the query (which is `select stock_quantity from...`)
                            updateDB(parseInt(orig), ans.userQuantity, ans.prodID, conn);
                        });
                } else {
                    console.log("Insufficient quantity~");
                    askCustomer(conn);
                }
            });
    });
}//askCustomer

function updateDB(orig, userAmt, itemID, conn) {
    //query to reduce the amount of quantity by user amount
    var query = conn.query(
        "UPDATE products SET ? WHERE ?;",
        [
            {
                stock_quantity: parseInt(orig) - parseInt(userAmt)
            },
            {
                item_id: itemID
            }
        ], function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
        });
    console.log("update query: ", query.sql);
    displayAllItems(conn);
    // conn.end();
} //updateDB
