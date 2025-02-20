const mongoose = require("mongoose");
const validator = require("validator");

//10.07.00
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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


//10.07 helper method for jwt token

userSchema.methods.getJWT = async function() {

  const user = this

   const token = await jwt.sign({_id: user._id}, "RUPESH@2110", {
        expiresIn: "7d"
   })

  return token
}

//10.09
userSchema.methods.validatePassword = async function(passwordInputByUser){

  const user = this

  const passwordHash = user.password

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

  return isPasswordValid
}

module.exports = mongoose.model("User", userSchema);