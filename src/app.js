//it is starting point of my application
console.log("starting a new project")

const express = require('express');
//from UI Part 2
const cors = require("cors")

//Season 3 part 5
require("dotenv").config()

//06. 00 importing DB
const connectDB = require("./config/database")

//06. 03 importing Model to store userObj
// const User = require("./models/user")

//09.03
// const {validateSignUpData} = require("./utils/validation")
// const bcrypt = require("bcrypt")

//10.02 to parse the cookies
const cookieParser = require("cookie-parser")

// const jwt = require("jsonwebtoken")

//10.07
// const { userAuth } = require("./middlewares/auth")

const app = express(); //new application of express,new express.js application i.e it is like creating new web server

// app.use((req, res) => {
//   res.send("Hello from the server") //this function is request handler and it is responding to the request
// })

//from UI Part 2(origin: "http://local" //whitelisting this domain name set cookies in the ui side as well(if you don't provide this, cookies will not be set due to unsecured network))
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

//07.02 middleware for converting json to js object, since here we are not passing any route just route handler hence it will work for all req
app.use(express.json())

//10.03
app.use(cookieParser())

//11.04 importing all the routers
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests");
const userRouter = require('./routes/user');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
//13.03
app.use("/", userRouter)


//06. 02 creating a user using model
// app.post("/signup", async (req,res) => {
//   try{
//   //09.01 Validation of data whenever user signup.login and encrypt the password(we create a helper function to validate (in the utils folder))
//   validateSignUpData(req)

//   //09.04 need to encrypt the password before saving it to table
//   const {firstName, lastName, emailId, password} = req.body
//   const passwordHash = await bcrypt.hash(password, 10)

//   console.log(passwordHash)

//   //07. 01 it will say undefined since req.body from the postman is in json format and our server is not able to read that, we need a middleware to convert JSON into js object.
//   // console.log("Req: ", req.body)


//   // const userObj = {
//   //   firstName: "Virat",
//   //   lastName: "Kohli",
//   //   emailId: "kohli@gmail.com",
//   //   password: "kohli123"
//   // }

//   //06. 04 creating a new instance of the user Model
//   // const user = new User(userObj)


//   const existingUser = await User.findOne({ emailId });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//   //07.03 creating instance
//   const user = new User({
//     firstName, lastName, emailId, password: passwordHash
//   })

//   //06.05 saving data to model
  
//     await user.save()
//     res.send("User added successfully")
//   }catch(err){
//     res.status(400).send(`Error saving the user: ${err.message}`)
//   }
// })


//09.05 login api
// app.post("/login", async (req, res) => {
//   try{
//     const { emailId, password } = req.body

//     const user = await User.findOne({emailId: emailId})

//     if(!user){
//       throw new Error("Invalid credentials")
//     }

//     // const isPasswordValid = await bcrypt.compare(password, user.password)

//     //10.10 using helper/schema methods
//     const isPasswordValid = await user.validatePassword(password)

//     if(isPasswordValid){

//       //10.01 Create a JWT Token

//       // const token = await jwt.sign({_id: user._id}, "RUPESH@2110", {
//       //   expiresIn: "7d"
//       // }) //here we are hiding user is by doing this {_id: user._id}

//       //10.09 using the helper/schema methods
//       const token = await user.getJWT()

//       //10.01 Add the token to cookie and send the response back to the user
//       res.cookie("token",token, {expires: new Date(Date.now() + 8 * 36000000)})
//       res.send("Login Successful!!!")
//     }else{
//       console.log("here: ")
//       throw new Error("Invalid credentials")
//     }

//   }catch(err){
//     res.status(400).send("Error: " + err.message)
//   }
// })

// app.get("/profile", userAuth, async (req, res) => {
//   try{

//   const user = req.user

//   res.send("Logged in user is " + user)
//   }catch(err){
//     res.status(400).send("Error: " + err.message)
//   }
// })

// app.post("/sendConnectionRequest", userAuth, (req, res) => {

//   const user = req.user

//   res.send("Connection Req sent by " + user.firstName)
// })

//07.04 fetchAPI, get user by email
// app.get("/user", async (req,res) => {
//   const userEmail = req.body.emailId
//   try{
//     const user = await User.find({emailId: userEmail});
//     if(user.length === 0){
//       res.status(400).send("user not found")
//     }
//     res.send(user)
//   }catch(err){
//     res.status(400).send("Something went wrong")
//   }

// })

//to update user by id
// app.patch("/user/:userId", async (req,res) => {

//   //07.06 to get user id
//   // const userId = req.body.userId;

//   //08.05
//   const userId = req.params?.userId

//   const data = req.body;

//   //08.05 if we to put restrications on updating
//   try{

//     const ALLOWED_UPDATES = [
//       "photoUrl", "about", "gender", "age", "skills"
//     ]
  
//     const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
  
//     if(!isUpdateAllowed){
//       throw new Error("Update not allowed")
//     }

//     if(data?.skills?.length > 10){
//       throw new Error("Skills not more than 10")
//     }

//     const user = await User.findByIdAndUpdate({_id: userId}, data,{
//       returnDocument: "after", // it is only required when you want your validate() in schema works for already existed document/data
//       runValidators: true
//     });
//     console.log(user)
//     res.send("User updated succeefully")
//   }catch(err){
//     res.status(400).send("Something went wrong: " + err.message)
//   }

// })

//07.05 fetchAPI, get users
// app.get("/feed", async (req,res) => {
//   try{
//     const user = await User.find({});
//     if(user.length === 0){
//       res.status(400).send("user not found")
//     }
//     res.send(user)
//   }catch(err){
//     res.status(400).send("Something went wrong")
//   }

// })



//06. 01 connecting to DB
connectDB().then(() => {
  console.log("Database connected successfully")

  app.listen(process.env.PORT, () => { // listening to server after DB connected successfully
    console.log("server is successfully listening on port 3000")
  }); 
}).catch((err) => {
  console.log("Database connected failed", err)
})

// app.listen(3000, () => { // our server is listening at port 3000
//   console.log("server is successfully listening on port 3000")
// }); ull)