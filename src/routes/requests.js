//11.04 router for request apis
const express = require('express');

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');

const User = require("../models/user")

//12.03
requestRouter.post("/request/send/:status/:toUserId", 
  userAuth, 
  async (req, res) => {
    try{
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status

      const allowedStatus = ["ignored", "interested"];

      // if(fromUserId === toUserId){
      //   return res.status(400).json({
      //     message: "Sending to request to self"
      //   })
      // }

      if(!allowedStatus.includes(status)){
        return res.status(400).json({
          message: "Invalid status type :" + status
        })
      }

      const toUser = await User.findById(toUserId);

      if(!toUser){
        return res.status(400).json({
          message: "User not found"
        })
      }

      //if there is a existing ConnectionReques
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {fromUserId,toUserId}, //here we are checking whether connection request was already send by the user to another user
          {fromUserId: toUserId, toUserId: fromUserId} ////here we are checking whether connection request was already send by the another user to the user
        ],
      })

      if(existingConnectionRequest){
        return res.status(400).send({message: "Connection request already exist!!!"})
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      });

      const data = await connectionRequest.save();

      res.json({
        message: `Connection Request ${status} successfully!!!`,
        data,
      })

    }catch(err){
      res.status(400).send("Error: " + err.message)
    }
  
})

//13.01, here requestId is id of the connectionRequest
requestRouter.post("/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try{
      const loggedInUser = req.user;
      const {status, requestId} = req?.params

      // Validate the status
      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "Status not allowed"})
      }

      // Akshay => Elon
      // loggedInId === toUserId
      // status = interested
      // requestId should be valid
      console.log("_id ", requestId, " toUserId ", loggedInUser._id.toString())
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id.toString(),
        status: "interested"
      })
      if(!connectionRequest){
        return res.status(400).json({message: "Connection request not found"})
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${status} successfully `,
        data
      })


    }catch(err){
      res.status(400).send("Error: " + err.message)
    }
  }
)

module.exports = requestRouter