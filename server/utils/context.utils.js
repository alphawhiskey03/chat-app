const jwt=require("jsonwebtoken")
const {JWT_SECRET_KEY}=require("../config")
const {AuthenticationError} =require("apollo-server")
module.exports=async context=>{
    if (context.req && context.req.headers.authorization) {
        const token = context.req.headers.authorization.split("Bearer ")[1];
        jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
          context.user=decodedToken 
        });
      }
      return context
}