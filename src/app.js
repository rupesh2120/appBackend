//it is starting point of my application
console.log("starting a new project")

const express = require('express');

//06. 00 importing DB
const connectDB = require("./config/database")

//06. 03 importing Model to store userObj
const User = require("./models/user")

const app = express(); //new application of express,new express.js application i.e it is like creating new web server

// app.use((req, res) => {
//   res.send("Hello from the server") //this function is request handler and it is responding to the request
// })

//07.02 middleware for converting json to js object, since here we are not passing any route just route handler hence it will work for all req
app.use(express.json())


//06. 02 creating a user using model
app.post("/signup", async (req,res) => {

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

  //07.03 creating instance
  const user = new User(req.body)

  //06.05 saving data to model
  try{
    await user.save()
    res.send("User added successfully")
  }catch(err){
    res.status(400).send(`Error saving the user: ${err.message}`)
  }
})

//07.04 fetchAPI, get user by email
app.get("/user", async (req,res) => {
  const userEmail = req.body.emailId
  try{
    const user = await User.find({emailId: userEmail});
    if(user.length === 0){
      res.status(400).send("user not found")
    }
    res.send(user)
  }catch(err){
    res.status(400).send("Something went wrong")
  }

})

//to update user by id
app.patch("/user/:userId", async (req,res) => {

  //07.06 to get user id
  // const userId = req.body.userId;

  //08.05
  const userId = req.params?.userId

  const data = req.body;

  //08.05 if we to put restrications on updating
  try{

    const ALLOWED_UPDATES = [
      "photoUrl", "about", "gender", "age", "skills"
    ]
  
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
  
    if(!isUpdateAllowed){
      throw new Error("Update not allowed")
    }

    if(data?.skills?.length > 10){
      throw new Error("Skills not more than 10")
    }

    const user = await User.findByIdAndUpdate({_id: userId}, data,{
      returnDocument: "after", // it is only required when you want your validate() in schema works for already existed document/data
      runValidators: true
    });
    console.log(user)
    res.send("User updated succeefully")
  }catch(err){
    res.status(400).send("Something went wrong: " + err.message)
  }

})

//07.05 fetchAPI, get users
app.get("/feed", async (req,res) => {
  try{
    const user = await User.find({});
    if(user.length === 0){
      res.status(400).send("user not found")
    }
    res.send(user)
  }catch(err){
    res.status(400).send("Something went wrong")
  }

})



//06. 01 connecting to DB
connectDB().then(() => {
  console.log("Database connected successfully")

  app.listen(3000, () => { // listening to server after DB connected successfully
    console.log("server is successfully listening on port 3000")
  }); 
}).catch((err) => {
  console.log("Database connected failed", err)
})

// app.listen(3000, () => { // our server is listening at port 3000
//   console.log("server is successfully listening on port 3000")
// }); 