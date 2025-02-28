const jwt = require("jsonwebtoken")
const User = require("../models/user")

//10.06 creating middleware for token authentication
const userAuth = async (req, res, next) => {
  try{
    const {token} = req.cookies;

    if(!token){
      return res.status(401).send("You are logged in!!");
    }

    const decodedMessage = await jwt.verify(token, "RUPESH@2110") 

    const { _id } = decodedMessage

    const user = await User.findById({_id})
    
    if(!user){
      throw new Error("User does not exist")
    }

    req.user = user
    next() //it is called to move to next request handler
  }catch(err){
    res.status(400).send("Something went wrong: " + err.message)
  }
  
}

module.exports = {
  userAuth
}