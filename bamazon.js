const mysql = require('mysql');
const inq = require('inquirer');
let orderTotal = [];
let products = [];
let cartItems = [];

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
            // console.log(answer.quantity)
            if (answer.quantity<=data[parseFloat(answer.product)].stock_quantity){
                orderTotal.push((parseFloat(Math.round(data[parseInt(answer.product)-1].price*100)/100))*parseInt(answer.quantity));
                cartItems.push(`${answer.quantity} ${data[parseInt(answer.product)-1].product_name}`);

                connection.query('update products set ? where ?', 
                [{stock_quantity: data[parseInt(answer.product)].stock_quantity-parseInt(answer.quantity)},
                {product_name: data[parseInt(answer.product)].product_name}], (err)=>{
                    
                    if(err) throw err;
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
                            cart();
                        } else {
                            products.pop();
                            cart.pop();
                            orderTotal.pop();
                            cart();
                        }
                    })
                }); connection.end()

            } else {
                console.log(data[parseInt(answer.product-1)].stock_quantity)
                console.log(parseInt(answer.quantity)-data[parseInt(answer.product-1)].stock_quantity)                    
                inq.prompt([
                    {
                        type: 'confirm',
                        message: `We're sorry but we currently only have ${data[parseInt(answer.product)-1].stock_quantity} ${data[parseInt(answer.product)-1].product_name} in stock.  Would you like to order ${parseFloat(data[parseInt(answer.product-1)].stock_quantity)} ${data[parseInt(answer.product)-1].product_name} now and place the other ${Math.abs(parseInt(data[parseInt(answer.product)-1].stock_quantity-parseInt(answer.quantity)))} on backorder?`,
                        name: 'backorder',
                        default: false
                    }
                ]).then(answer=>{
                    if (answer.backorder){
                        backOrder(parseInt(answer.quantity)-data[parseInt(answer.product-1)].stock_quantity, data[parseInt(answer.product-1)].product_name);
                        cart();
                    } else {
                        cart();
                    }
                })
            }
        })
    })
}

total = (total, num) => {
    return parseFloat(total) + parseFloat(num);
}

// Have a 'backorder' function if customer wants to purchase more than what's in stock

cart = () => {
    inq.prompt([
        {
            type: 'list',
            message: `You now have ${cartItems.join(', ')} in your cart for a total of ${orderTotal.reduce(total)}. What you like to do?`,
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

backOrder = (orderQuan, product) => {
    connection.query('update products set backorder=? stock_quantity=0 where product_name=?', [orderQuan, product], err =>{
        if (err) throw err;
        console.log(`You have placed ${orderQuan} ${product} on backorder.  We will inform you when they arrive!`)
    })
}