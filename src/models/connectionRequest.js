//12.01
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

  fromUserId: {
    type: mongoose.Schema.Types.ObjectId, //id of user from mongoose
    ref: "User", //13.04 creating relation between connection request's fromUserId to the referece to user collection
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId, //id of user from mongoose
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrected status type`
    },
    required: true
  }
},{
  timestamps: true
}
)

//12.09 compounding indexing { fromUserId: 1, toUserId: 1}
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1}) //1 means asending order and -1 meas desc

//12.07 it will called before you save, here always write the function not arrow function
connectionRequestSchema.pre("save", function (next){
  const connectionRequest = this;
  //check if the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection to self")
  }
  next()
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel