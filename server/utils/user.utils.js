const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config");
const generateToken = async (username, email, id) => {
    const token = jwt.sign(
      {
        email,
        username,
        id,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return token;
  };
  const unreadCounter=(latestMessage,user)=>{
    let unread=0
    function counterFunc(prev,cur){
      if(!cur.read && cur.to===user){
        return prev+1
      }else{
        return prev
      }
    }
     unread=latestMessage.reduce(counterFunc,0)
  return unread
  
  }
  const findLatestMessage=async (latestMessage,user)=>{
   
    let userMessages=latestMessage.map(lM=>{
      if(lM.to===user || lM.from===user){
        return lM
      }
    }).filter(val=>typeof val!=='undefined')
  let newest=userMessages[0];
  for(let i=0;i<userMessages.length;i++){
    if(new Date(userMessages[i].createdAt)>new Date(newest.createdAt)){
      newest=userMessages[i]
    }
  }
  return newest
  }

  module.exports={
    generateToken,
    unreadCounter,
    findLatestMessage
  }