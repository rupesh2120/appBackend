const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, //08.01 it must be there
    minLength: 4
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    validate(value){
      if(!["male", "female", "others"].includes(value)){
        throw new Error("Gender data is not valid")
      }
    }
  },
  photoUrl: {
    type: String
  },
  about: {
    type: String,
    default: "This is a default about of the user" //08.03
  },
  skills: {
    type: [String]
  }
},
{
  timestamps: true
});

// const User = mongoose.model("User", userSchema);

// module.exports = User

//OR

module.exports = mongoose.model("User", userSchema);