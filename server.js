const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information, get_total_amount } = require('./models/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');

// app.get('/', (req, res)=>{
//   res.send('Hello Web 2.0');
// })
//
// app.listen(3000, ()=>{
//   console.log('server is running on port 3000');
// })

//its inform the post request api or other api that we are passing data value either from postman or any other medium
app.use(bodyParser.json());
app.use(express.static(publicPath));

//inserting data to db
// app.post('/', (req, res)=>{
//   var email = req.body.email;
//   var amount = req.body.amount;
//
// //validating user to check if the amount is less or equal to 1 then test the if statement with postman
//   if(amount <= 1){
//     return_info = {};
//     return_info.error = true;
//     return_info.message = "The amount should be greater than 1";
//     return res.send(return_info);
//   }
//
// //using postman to test if the post request will work
//   res.send({"amount": amount, "email": email});
// });

//paypal configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AUattrzRvD_rSeNbhYGbVcMtAGQV1UtHABKI_5yrI1io3BHOxwtj60usgfeUhsH08psy2XZ07_7uXO0-',
  'client_secret': 'EMk-Br_Irk6Af26OZV8xpFDq82kbweO-l8VA0aLGnVNgNJBxpCigt4ApODIo2XIbfPvXqVtWakrp6GMR'
});

//async post request function
app.post('/post_info', async (req, res)=>{
  var email = req.body.email;
  var amount = req.body.amount;

  if(amount <= 1){
    return_info = {};
    return_info.error = true;
    return_info.message = "The amount should be greater than 1";
    return res.send(return_info);
  }

//insert into db
var result = await save_user_information({"amount":amount, "email":email});
// res.send({"amount": amount, "email": email});

var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Lottery",
                "sku": "Funding",
                "price": amount,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": amount
        },
        'payee':{ //add this property its manager infor
          'email': 'managerlottery@gmail.com'
        },
        "description": "Lottery Purchase."
    }]
};


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);

        //write a code that will read the content of payment array and redirect the users to paypal website
        for(var i=0; i < payment.links.length; i++){
          if(payment.links[i].rel == 'approval_url'){
            return res.send(payment.links[i].href);
          }
        }
    }
});
// res.send(result);
});

//fetching data from db
app.get('/get_total_amount', async(req, res)=>{
  var result = await get_total_amount();
  // console.log(result);
  res.send(result);
});

app.listen(3000, ()=>{
  console.log('server is running on port 3000');
})
