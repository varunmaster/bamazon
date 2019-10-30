# bamazon
An application to mimic enterprise resource planning system.
​
## Motivation
Create an application to practice **Javascript**, **Node.js** and **MySQL**.
​
## Technologies used and why
**Javascript** is used to build user interface and read/write sql database.  
**Node.js** is used to execute the application in the terminal.  
**MySQL** is a database used to store inventory and sales data.
​
## How to use

### bamazonCustomer

1. By using `node bamazonCustomer.js`, a customer is able to purchase items.
2. If the item is out of stock, terminal will return *'Insufficient Inventory~'*.
3. The user will be prompted again whether they want to buy or exit.
​
Please see below demo:
​
![bamazon_Customer](/images/customer.gif)
------
### bamazon_Manager
​
1. By using `node bamazonManager.js`, as a manager is able to access item inventory.
​
2. There are 4 functions the manager can do:
​
    1. Review item inventory
​
    2. Display low inventory items
​
    3. Add inventory to items
​
    4. Add new items
​
Please see below demo:
​
![bamazon_Manager](/images/manager.gif)
------
### bamazon_Supervisor
​
1. By using `node bamazonSupervisor.js`, a supervisor is able to review department sales and create new departments.

2. Once a new department has been added, **there must be products added under that department otherwise the resulting query will return null**

Please see below demo:
​
![bamazon_Supervisor](/images/supervisor.gif)