const express = require('express');
const app = express();

// app.get('/', (req, res)=>{
//   res.send('Hello Web 2.0');
// })
//
// app.listen(3000, ()=>{
//   console.log('server is running on port 3000');
// })

app.post('/', (req, res)=>{
  var email = req.body.email;
  var amount = req.body.amount;

  //test if the post request will work
  res.send({"amount": amount, "email": email});
});

app.listen(3000, ()=>{
  console.log('server is running on port 3000');
})
