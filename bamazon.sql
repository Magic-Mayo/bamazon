create database bamazon;
use bamazon;

create table products (
	item_id integer not null auto_increment,
    product_name varchar(100) null,
    department_name varchar(50) null,
    price decimal(6,2) null,
    stock_quantity integer null,
    primary key (item_id));
    
insert into products (product_name, department_name, price, stock_quantity)
	values ('milk', 'dairy', 3.19, 100), ('toilet_paper', 'bathroom', 9.99, 50), ('lettuce', 'produce', .99, 30), ('pizza', 'frozen_food', 5.99, 49), 
    ('light_bulb', 'household', 1.93, 293),	('steak', 'meat', 15.42, 10), ('ketchup', 'condiments', 2.99, 64), ('bananas', 'produce', .49, 138), ('M&M', 'candy', 3.48, 58),
    ('AA_battery', 'household', 2.39, 39);