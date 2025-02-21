//11.01 router for auth apis
const express = require('express');

const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation")

const User = require("../models/user")

const bcrypt = require("bcrypt")

//11.02 creating apis usig router
authRouter.post("/signup", async (req,res) => {
  try{
  //09.01 Validation of data whenever user signup.login and encrypt the password(we create a helper function to validate (in the utils folder))
  validateSignUpData(req)

  //09.04 need to encrypt the password before saving it to table
  const {firstName, lastName, emailId, password} = req.body
  const passwordHash = await bcrypt.hash(password, 10)

  console.log(passwordHash)

  //07. 01 it will say undefined since req.body from the postman is in json format and our server is not able to read that, we need a middleware to convert JSON into js object.
  // console.log("Req: ", req.body)


  // const userObj = {
  //   firstName: "Virat",
  //   lastName: "Kohli",
  //   emailId: "kohli@gmail.com",
  //   password: "kohli123"
  // }

  //06. 04 creating a new instance of the user Model
  // const user = new User(userObj)


  const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

  //07.03 creating instance
  const user = new User({
    firstName, lastName, emailId, password: passwordHash
  })

  //06.05 saving data to model
  
    await user.save()
    res.send("User added successfully")
  }catch(err){
    res.status(400).send(`Error saving the user: ${err.message}`)
  }
})


authRouter.post("/login", async (req, res) => {
  try{
    const { emailId, password } = req.body

    const user = await User.findOne({emailId: emailId})

    if(!user){
      throw new Error("Invalid credentials")
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password)

    //10.10 using helper/schema methods
    const isPasswordValid = await user.validatePassword(password)

    if(isPasswordValid){

      //10.01 Create a JWT Token

      // const token = await jwt.sign({_id: user._id}, "RUPESH@2110", {
      //   expiresIn: "7d"
      // }) //here we are hiding user is by doing this {_id: user._id}

      //10.09 using the helper/schema methods
      const token = await user.getJWT()

      //10.01 Add the token to cookie and send the response back to the user
      res.cookie("token",token, {expires: new Date(Date.now() + 8 * 36000000)})
      res.send("Login Successful!!!")
    }else{
      console.log("here: ")
      throw new Error("Invalid credentials")
    }

  }catch(err){
    res.status(400).send("Error: " + err.message)
  }
})

module.exports = authRouter