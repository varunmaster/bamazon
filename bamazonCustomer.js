var mysql = require("mysql");
var inquirer = require("inquirer");
var Password = require("./passwordPrompt");

new Password().getPassword(loginCallback);

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
    var query = conn.query("Select * from products;",(err, res) => {
        if (err) console.log("Error is: ", err);
        console.table("Here is what we currently have in stock: \n", res);
    });
    console.log("This is the sql: ", query.sql);
    conn.end();
}
