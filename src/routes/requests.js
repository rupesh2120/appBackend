//11.04 router for request apis
const express = require('express');

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth")

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {

  const user = req.user

  res.send("Connection Req sent by " + user.firstName)
})

module.exports = requestRouter