//11.03 router for profile apis
const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth")

profileRouter.get("/profile", userAuth, async (req, res) => {
  try{

  const user = req.user

  res.send("Logged in user is " + user)
  }catch(err){
    res.status(400).send("Error: " + err.message)
  }
})


module.exports = profileRouter