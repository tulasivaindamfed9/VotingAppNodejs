// import jwt token
const jwt=require('jsonwebtoken')

require('dotenv').config()

//  jwt token middle ware fun is passed to all routes where user wants that page data
 const jwtAuthMiddleware= (req,res,next)=>{

    // first check req headers has authorization or not
    const authorization= req.headers.authorization
    if(!authorization) return res.status(401).json({error:"Token not found"})

    // extract jwt token from req headers
    // bearer token in TC or postman post method headers--auth-- in form of bearer "token here".
    //  So we use split to get token
    const token=req.headers.authorization.split(' ')[1]
    if(!token) return res.status(401).json({error:"Unauthorised"})

        // if we get token, wwe need to verify it
    try{

    //  token verification process
    const decoded=jwt.verify(token, process.env.JWT_SECRET)
    // this decoded has some sort of user data(payload). 
    // attach user information to the req object
    req.user=decoded
    next()

    } catch(err){
        console.log("token invalid")
        res.status(401).json({error:"Invalid token"})
    }   

 }
 
// function to genetrate jwt token
const generateToken= (userData)=>{
    // generate a new jwt token using user data and JWT_SECRET KEY and adding an expiry for the token in 30sec
    return jwt.sign(userData,process.env.JWT_SECRET, {expiresIn:30000})
}


 module.exports={jwtAuthMiddleware,generateToken}