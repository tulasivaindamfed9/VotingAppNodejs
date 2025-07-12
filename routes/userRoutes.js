// express router helps in code readability and divide code into diff components => same like in front end react-router-dom
// importing express router from express
const express=require('express')
const router=express.Router()
// importing user model from user.js file
const User = require("../models/user");

// to generate a token when user signup for the first time, we import funs from jwt.ja file
const{jwtAuthMiddleware,generateToken}= require('./../jwt');


// POST route to add a user
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //assuming body-parser saves data in rew.body

    // createe new person's document using mongoose model
    const newUser= new User(data);

    // save newPerson to the database
    const response = await newUser.save();
    console.log("data saved");

    // using generateTOken fun from jwt.js file to generate token along with saving user data
    // here to generate token we are using user id which is in response data as a payload
   

    // generally we pass payload from response in the form of an obj. So let's pass id as payload to generate token
    // here we can send aadhar no. also as payload to generate token. But when hackers get the token they can easily see aadhar no. which is risky
    const payload={
      id: response.id,
    
    }
    const token=generateToken(payload)
    console.log("Token is : ", token)

    res.status(200).json({response:response , token:token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// login route
router.post('/login', async(req,res)=>{
  try{
    // extract aadhar no. and password from request body
    const {aadharNumber,password}= req.body

    // check if aadhar or password is missing
    if(!aadharNumber || !password){
      return res.status(400).json({message:"Aadhar number and password are required"})
    }

    // fing the user by aadhar no. in our db
    const user= await User.findOne({aadharNumber:aadharNumber})

    // if user does not exist or password doesnot match, return error
    if( !user || !(await user.comparePassword(password))){
      return res.status(401).json({error:"Invalid Aadhar number or password"})
    }

    // if user found in our data base, generate token
    const payload={
      id:user.id,
     
    }
    const token=generateToken(payload)
    // return token as response
    res.json({token:token})
  }catch(err){
    console.log(err)
    res.status(500).json({error:"Internal server error"})
  }

})

// profile route: 
// If a user want to check his profile, we just pass token of that user
// we extract id from token and check database using id and send the user details
router.get('/profile', jwtAuthMiddleware,async(req,res)=>{
  try{
    const userData=req.user 
    // req.user is getting from jwt.js file where user data is stored in decoded var

    // extract userid from userdata
    const userId=userData.id
    const user= await User.findById(userId)

    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
})


// update route to update(change) the password
router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
  try{
   const userId=req.user.id //extract id from token
  const {currentPassword,newPassword}=req.body //extract current and new passwords from request body

//   find the user by user id
const user=await User.findById(userId)

// if currrent password doesnot match
if(!(await user.comparePassword(currentPassword))){
    return res.status(401).json({error:'Invalid Aadhar number or password'})
}
  
// if current password match
user.password=newPassword
await user.save()
   console.log("password updated")
   res.status(200).json({message:"Password updated"})
  }catch(error){
    res.status(500).json({error:"Invalid server error"})
  }
})


module.exports=router
// comment added for testing