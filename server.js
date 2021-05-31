const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information, get_total_amount } = require('./models/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');

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

//async post request function
app.post('/', async (req, res)=>{
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
res.send(result);
});

//fetching data from db
app.get('/get_total_amount', async(req, res)=>{
  var result = await get_total_amount();
  console.log(result);
  res.send(result);
});

app.listen(3000, ()=>{
  console.log('server is running on port 3000');
})
