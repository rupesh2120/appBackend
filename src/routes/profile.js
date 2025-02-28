//11.03 router for profile apis
const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth")

const {validateEditProfileData} = require("../utils/validation")

//before it was just /profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try{

  const user = req.user

  res.send(user)
  }catch(err){
    res.status(400).send("Error: " + err.message)
  }
})

//11.06
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try{

    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request")
    }

    const loggedInUser = req?.user;

    console.log("User before: ", loggedInUser)

    Object.keys(req?.body).forEach(key => (loggedInUser[key] = req.body[key]))

    await loggedInUser.save()

    console.log("User After: ", loggedInUser)

    // res.send(`${loggedInUser.firstName}, your profile updated successfully!!`)

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully!!`,
      data: loggedInUser
  })

  }catch(err){
    res.status(400).send("Error " + err.message)
  }
})


module.exports = profileRouter