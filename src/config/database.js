const mongoose = require('mongoose');
//Season 3 part 5
// require("dotenv").config()

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET)
}

module.exports = connectDB;