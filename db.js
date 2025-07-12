// mongoose acts as a mediator between mongodb and node.js
const mongoose=require('mongoose')
require('dotenv').config() //imported .env file
// define the mongodb connection url
// const mongoURL=process.env.MONGODB_URL_LOCAL

// below url is mongo atlas url online
const mongoURL=process.env.MONGODB_URL

// now setup mongoose connection
mongoose.connect(mongoURL)

// get the default connection of mongoose
// mongoose maintain a default connecion object representing the mongodb connection
const db=mongoose.connection;

// define evetn listeners for atabase conncetion
// event listeners will listen to mongosb that if server is connected or not, which database is connected etc
db.on('connected', ()=>{
    console.log("connected to mongodb server")
})

db.on('disconnected',()=>{
    console.log('mongodb disconnected')
})

db.on('error',(err)=>{
    console.log('mongodb connection error',err)
})


// above process says: we imported mongoose, defined url and database name, 
// setup connction with mongoose, defined default conncetion obj, and defined event listeners
// now we need to export database connction
module.exports=db;