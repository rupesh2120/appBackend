//13.02
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

//13.08 populate these informations(you can either write array of informations or in a string separated by space)
const USER_SAFE = "firstName lastName gender age about photoUrl"

//13.04 Get all pending connection request for the logged in user
userRouter.get(
  "/user/requests/received",
  userAuth,
  async (req, res) => {
    try{

      const loggedInUser = req.user

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id.toString(),
        status: 'interested'
      }).populate("fromUserId", ["firstName", "lastName", "gender", "age", "about", "photoUrl"]) //13.06 populating user collection for this fromUserId to get firstName and lastName

      res.json({
        message: "Data sent successfully",
        data: connectionRequests
      })

    }catch{
      res.status(400).send("Error: " + err.message)
    }
  }
)


//13.07 Get all connected users for the logged in user
userRouter.get(
  "/user/connections",
  userAuth,
  async (req, res) => {
    try{

      const loggedInUser = req.user

      //Akshay => Elon => Accepted OR
      // Elon => Akshay => Accecpted

      const connectionRequests = await ConnectionRequest.find({
        $or: [
          { 
            toUserId: loggedInUser._id.toString(),
            status: 'accepted'
          },
          { 
            fromUserId: loggedInUser._id.toString(),
            status: 'accepted'
          }
        ]
      }).populate("fromUserId", USER_SAFE).populate("toUserId", USER_SAFE) //13.06 populating user collection for this fromUserId to get firstName and lastName

      const data = connectionRequests.map((row) => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
          return row.toUserId
        }
        return row.fromUserId
      });

      res.json({
        message: "Fetch sent successfully",
        data
      })

    }catch{
      res.status(400).send("Error: " + err.message)
    }
  }
)

//14.01
userRouter.get(
  "/feed",
  userAuth,
  async (req, res) => {
    try{

      //14.03 pagination
      const page = parseInt(req?.query?.page) || 1;
      let limit = parseInt(req?.query?.limit) || 10;
      limit = limit > 50 ? 50 : limit
      
      //skip formula: skip = (page - 1)*limit
      const skip = (page - 1)*limit

      //14.02
      // User should see all the user cards except:
      // 0. his own card
      // 1. his connections
      // 2. ignored people
      // 3. already sent the connection request
      // ishort if entry is created between the user and others in connectio requests, do not show those people in feed

      const loggedInUser = req.user;

      //find all connectio requests (sent + received)
      const connectionRequests = await ConnectionRequest.find({
        $or: [
          {fromUserId: loggedInUser._id},
          {toUserId: loggedInUser._id}
        ]
      }).select("fromUserId toUserId")

      //remove duplicates user's id
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach(req => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString())
      })

      console.log(hideUsersFromFeed)

      // const users = await User.find({
      //   $and: [
      //     {_id: { $nin: Array.from(hideUsersFromFeed)}},
      //     {_id: { $ne: loggedInUser._id}}
      //   ]
      // }).select(USER_SAFE)

      //14.04
      const users = await User.find({
        $and: [
          {_id: { $nin: Array.from(hideUsersFromFeed)}},
          {_id: { $ne: loggedInUser._id}}
        ]
      }).select(USER_SAFE).skip(skip).limit(limit)

      res.send(users)
      



    }
    catch(err){
      res.status(400).send("Error: " + err.message)
    }
  }
)

module.exports  = userRouter