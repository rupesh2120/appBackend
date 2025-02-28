const validator = require("validator")

//09.02 validation helper function
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body

  if(!firstName || !lastName){
    throw new Error("Name is not valid")
  }
  else if(firstName.lenght < 4 || firstName.lenght>50){
    throw new Error("Name length should between 4 and 50")
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid")
  }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills" ]

  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))

  return isEditAllowed;

}

module.exports = { validateSignUpData, validateEditProfileData }