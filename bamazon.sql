drop database if exists bamazon_db;

create database bamazon_db;

use bamazon_db;

drop table if exists products;

create table products (
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INTEGER NOT NULL,
stock_quantity INTEGER NOT NULL,
PRIMARY KEY (item_id)
);

insert into products
set product_name = 'Wireless Mouse', department_name = 'Electronics', price = 15, stock_quantity = 300;

insert into products
set product_name = 'Mechanical keyboard', department_name = 'Electronics', price = 50, stock_quantity = 100;

insert into products
set product_name = 'Top Gun DVD', department_name = 'Entertainment', price = 10, stock_quantity = 250;

insert into products
set product_name = 'Hat', department_name = 'Clothing', price = 15, stock_quantity = 500;

insert into products
set product_name = 'Pens', department_name = 'Stationery', price = 5, stock_quantity = 500;

insert into products
set product_name = 'SSD', department_name = 'Electronics', price = 85, stock_quantity = 300;

insert into products
set product_name = 'HDD', department_name = 'Electronics', price = 75, stock_quantity = 20;

insert into products
set product_name = 'Costume for dogs', department_name = 'Clothing', price = 25, stock_quantity = 75;

insert into products
set product_name = 'Fuzzy Blanket', department_name = 'Other', price = 35, stock_quantity = 150;

insert into products
set product_name = 'Life', department_name = 'Other', price = 1000000, stock_quantity = 1;

----------------------------------------------------------------------------------------------------------------
select * from products;

Select * from products;

update products set stock_quantity = 300 where item_id = 1;

