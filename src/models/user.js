const mongoose = require("mongoose");
const validator = require("validator")

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
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email "+ value)
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Your password is very weak: "+ value + ", Enter strong password")
      }
    }
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
    type: String,
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid photo url "+ value)
      }
    }
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