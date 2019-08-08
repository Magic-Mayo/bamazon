const mysql = require('mysql');
const inq = require('inquirer');
let orderTotal = [];
let products = [];
let cart = [];

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
        choices = ()=>{
            for (let i=0; i<data.length; i++){
                products.push(`${data[i].item_id}) ${data[i].product_name}: $${data[i].price}`)
            }
        }

        if (products.length===0){
            choices();
        }

        console.log(products.join('\n'));

        inq.prompt([
            {
                type: 'number',
                name: 'product',
                message: 'Please enter the ID number of the product would you like to purchase: ',
            },{
                type: 'number',
                message: 'Enter the quantity you wish to order: ',
                name: 'quantity'
            }
        ]).then(answer => {
            // console.log(answer.product)
            orderTotal.push((parseFloat(Math.round(data[parseInt(answer.product)-1].price*100)/100))*parseInt(answer.quantity));
            cart.push(`${answer.quantity} ${data[parseInt(answer.product)-1].product_name}`)
            // console.log(orderTotal)
            // orderProduct(answer.product, answer.quantity);
            inq.prompt([
                {
                    type: 'confirm',
                    message: `You have ordered ${answer.quantity} ${data[parseInt(answer.product)-1].product_name}.  Is this correct?`,
                    name: 'confirm',
                    default: true
                }
            ]).then(answer=>{
                if (answer.confirm){
                    inq.prompt(
                        {
                            type: 'confirm',
                            message: 'Would you like to order anything else?',
                            name: 'ordermore',
                            default: false
                        }).then(answer=>{
                        if (answer.ordermore){
                            userInput();
                        } else {
                            console.log(`Order Placed!  Your total is: $${orderTotal.reduce(total)}`);
                            connection.end();
                        }
                    })
                } else {
                    products.pop();
                    cart.pop();
                    orderTotal.pop();
                    inq.prompt([
                        {
                            type: 'list',
                            message: `You now have ${cart} in your cart. What you like to do?`,
                            choices: ['Order more', 'Checkout'],
                            name: 'cart'
                        }
                    ]).then(answer=>{
                        if (answer.cart === 'Order more'){
                            userInput();
                        } else {
                            console.log(`Order Placed!  Your total is: $${orderTotal.reduce(total)}`);
                            connection.end();
                        }
                    })

                }
            })
        })
    })
}

total = (total, num) => {
    return parseFloat(total) + parseFloat(num);
}

// Have a 'backorder' function if customer wants to purchase more than what's in stock