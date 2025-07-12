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

app.get('/',(req,res)=>{
  res.send("Welcome to voting app")
})

// our server is active at port 3000 ie at adress http://localhost:3000
app.listen(PORT,()=>{
  console.log('Listening to port')
});
