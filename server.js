const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// app.get('/', (req, res)=>{
//   res.send('Hello Web 2.0');
// })
//
// app.listen(3000, ()=>{
//   console.log('server is running on port 3000');
// })

//its inform the post request api or other api that we are passing data value either from postman or any other medium
app.use(bodyParser.json());

app.post('/', (req, res)=>{
  var email = req.body.email;
  var amount = req.body.amount;

//validating user to check if the amount is less or equal to 1 then test the if statement with postman
  if(amount <= 1){
    return_info = {};
    return_info.error = true;
    return_info.message = "The amount should be greater than 1";
    return res.send(return_info);
  }

//using postman to test if the post request will work
  res.send({"amount": amount, "email": email});
});

app.listen(3000, ()=>{
  console.log('server is running on port 3000');
})
