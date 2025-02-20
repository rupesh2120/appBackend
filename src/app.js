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
  console.log("Req: ", req.body)


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
    res.status(400).send("Error saving the user: ", + err.message)
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