const { model, Schema } = require("mongoose");

const MessageSchema = new Schema({
  content: {
    type:String,
    required:true
  },
  from: {
    type:String,
    required:true
  },
  to:{
    type:String,
    required:true
  },
  read:{
    type:Boolean,
    default:false
  },
  createdAt:{
    type:String,
    required:true
  },
  updatedAt:{
    type:String
  }
});

module.exports = model("messages", MessageSchema);
