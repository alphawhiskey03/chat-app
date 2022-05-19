const dotenv = require("dotenv");


const result=dotenv.config();
const envs=result.parsed
module.exports.MONGODB_CONNECTION_STRING =envs.MONGODB_CONNECTION_STRING;
module.exports.JWT_SECRET_KEY=envs.SECRET_KEY
