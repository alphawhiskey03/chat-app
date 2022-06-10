const {model,Schema}=require("mongoose")

const reactionSchema=new Schema({
    messageId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    }
})

module.exports=model('Reactions',reactionSchema)

