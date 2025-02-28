const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://namastedev:WqF0z4T4iZuKepBA@namastenode.vbecc.mongodb.net/devTinder")
}

module.exports = connectDB;