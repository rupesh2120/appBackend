//it is starting point of my application
console.log("starting a new project")

const express = require('express');

const app = express(); //new application of express,new express.js application i.e it is like creating new web server

app.use((req, res) => {
  res.send("Hello from the server") //this function is request handler and it is responding to the request
})

app.listen(3000, () => { // our server is listening at port 3000
  console.log("server is successfully listening on port 3000")
}); 