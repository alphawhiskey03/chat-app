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
  createdAt:{
    type:String,
    required:true
  },
  updatedAt:{
    type:String
  }
});

module.exports = model("messages", MessageSchema);
