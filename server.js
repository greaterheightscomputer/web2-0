const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information, get_total_amount } = require('./models/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');
const session = require('express-session');

// app.get('/', (req, res)=>{
//   res.send('Hello Web 2.0');
// })
//
// app.listen(3000, ()=>{
//   console.log('server is running on port 3000');
// })

//configure session
app.use(session({secret: 'my web app', cookie: {maxAge: 60000}}));

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
var fee_amount = amount * 0.968; //deduct paypal fee from the total amount
var result = await save_user_information({"amount":fee_amount, "email":email});
// res.send({"amount": amount, "email": email});
req.session.paypal_amount = amount; //store on session

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
        'payee':{ //add this property so that the manager will receive payment once a Participant pay
          'email': 'managerlottery@gmail.com'
        },
        "description": "Lottery Purchase."
    }]
};

//redirect user to paypal from view
paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);

        //write a code that will read the content of payment object and redirect the users to paypal website
        for(var i=0; i < payment.links.length; i++){
          if(payment.links[i].rel == 'approval_url'){
            console.log(payment.links[i].href);
            return res.send(payment.links[i].href);
          }
        }
    }
});
// res.send(result);
});

//user actual make payment to manager account
//get request function '/success' url argument must be the samething with create_payment_json object with "redirect_urls" property which value is "return_url": "http://localhost:3000/success",
app.get('/success', (req, res)=>{
  const payerId = req.query.PayerID; //get the value of req.query.PayerID from the url
  const paymentId = req.query.paymentId; //get the value of  req.query.paymentId from the url
  var execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount":{
        "currency": "USD",
        // "total": 100
        "total": req.session.paypal_amount
      }
    }]
  };

  //paypal predefined method to execute payment from the Participant to manager account
  paypal.payment.execute(paymentId, execute_payment_json, function(err, payment){
    if(err){
      console.log(error.response);
      throw error;
    }else{
      console.log(payment);
    }
  });
  res.redirect('http://localhost:3000'); //redirect user back to localhost
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
