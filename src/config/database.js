const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://namastedev:79kRtuDOiKjVq1TN@namastenode.vbecc.mongodb.net/devTinder")
}

module.exports = connectDB;