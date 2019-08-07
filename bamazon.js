const mysql = require('mysql');
const inq = require('inquirer');
let orderTotal = [];

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1fafp404",
    database: "bamazon"
  });

connection.query('select * from products', (err,data)=>{
    if(err) throw err;
    // console.log(data);
    userInput();
})

userInput = () => {
    connection.query('select * from products', (err, data)=>{
        if (err) throw err;
        inq.prompt(
            {
                type: 'rawlist',
                name: 'product',
                choices: ()=>{
                    const products = [];
                    for (let i=0; i<data.length; i++){
                        products.push(`${data[i].product_name}: $${data[i].price}`)
                    } return products;
                },
                message: 'Which product would you like to purchase?',
            },{
                type: 'number',
                message: 'Enter the quantity you wish to order: ',
                name: 'quantity'
            }).then(answer => {
            orderTotal.push()
            orderProduct(answer.product, answer.quantity);
            inq.prompt(
                {
                    type: 'confirm',
                    message: 'Would you like to order anything else?',
                    name: 'ordermore',
                    default: false
                }).then(answer=>{
                if (answer.ordermore){
                    userInput()
                } else {
                    console.log(`Order Placed!  Your total is: $${total(orderTotal)}`);
                    connection.end();
                }
            })
        })
    })
}

total = (input) => {
    return input.reduce((a,b)=>a+b, 0)
}

orderProduct = (product, quantity) => {

}