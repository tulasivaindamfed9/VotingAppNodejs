// importing express and storing it in app
const express = require("express");
const app = express();
require('dotenv').config()
// importing mongodb server
const db = require("./db");

// importing body-parser after installing it
const bodyParser = require("body-parser");
app.use(bodyParser.json()); //req.body

// import routers files
const userRoutes=require('./routes/userRoutes')
const candidateRoutes=require('./routes/candidateRoutes')

// use the routes 
app.use('/user',userRoutes)
app.use('/candidate',candidateRoutes)



const PORT=process.env.PORT ||3000

app.get('/', (req, res) => {
  res.send(`
    <h2>Welcome to voting app</h2>
    <h3>Available Routes:</h3>
    <ul>
      <li><strong>POST</strong> /user/signup</li>
      <li><strong>POST</strong> /user/login</li>
      <li><strong>GET</strong> /user/profile</li>
      <li><strong>PUT</strong> /user/profile/password</li>
      <li><strong>POST</strong> /candidate <em>(with JWT token)</em></li>
      <li><strong>PUT</strong> /candidate/:id <em>(with JWT token)</em></li>
      <li><strong>DELETE</strong> /candidate/:id <em>(with JWT token)</em></li>
      <li><strong>POST</strong> /candidate/vote/:candidateId <em>(with JWT token)</em></li>
      <li><strong>GET</strong> /candidate/vote/count</li>
    </ul>
    <p>Test these routes in Postman.</p>
  `);
});

// our server is active at port 3000 ie at adress http://localhost:3000
app.listen(PORT,()=>{
  console.log('Listening to port')
});
