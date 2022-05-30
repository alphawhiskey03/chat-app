const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config");
const {AuthenticationError}=require("apollo-server-express")
const contextMiddleware = async (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
      context.user = decodedToken;
    });
    return context;
  }
};

const subscriptionAuth=(connectionParams)=>{
  let token
  try{

  if(connectionParams && connectionParams.Authorization){
   token=connectionParams.Authorization.split("Bearer ")[1]
   let decodedTok
   if(token){
    jwt.verify(token,JWT_SECRET_KEY,(err,decodedToken)=>{
      if(decodedToken){
        decodedTok=decodedToken
      }
    })
  }
    return decodedTok
  }
}catch(err){
  console.log(err)
}
}

module.exports={
  contextMiddleware,
  subscriptionAuth
}

