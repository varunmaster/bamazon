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
        supervisorChoices(connection);
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
                viewSales(conn);
                break;
            case "Create New Department":
                newDept(conn);
                break;
            default:
                conn.end();
                process.exit(0);
        }
    });
}

function viewSales(conn) {
    conn.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(product_sales) AS department_sales, (SUM(product_sales) - departments.over_head_costs) AS total_profit FROM products RIGHT JOIN departments ON departments.department_name = products.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_costs order by department_sales, total_profit;",
        (err, res) => {
            if (err) console.log("Error is: ", err);
            console.table(res);
            console.log("\n\n");
            supervisorChoices(conn);
        });
}

function newDept(conn) {
    inquirer.prompt(
        [
            {
                name: "deptName",
                message: "What is the name of the new department you want to add?",
                type: "input"
            },
            {
                name: "overheadCost",
                message: "What is the over head cost of this department?",
                type: "number"
            }
        ]
    ).then((ans) => {
        var values = [ans.deptName, parseInt(ans.overheadCost)];
        //if no 'products' exist for this department then it will not show in the viewSales() as that is an inner join
        conn.query("INSERT INTO departments (department_name, over_head_costs) values (?);",
            [values],
            (err, res) => {
                if (err) console.log("Error is: ", err + "\n");
                else console.log(res.affectedRows + " products updated!\n\n");
                supervisorChoices(conn);
            });
    });
}
