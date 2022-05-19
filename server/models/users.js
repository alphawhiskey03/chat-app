const { model, Schema } = require("mongoose");

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl:{
    type:String
  },
  password:{
    type:String,
    required:true,
  },
  createdAt:{
    type:String,
    required:true
  }
});

module.exports = model("users", userSchema);
