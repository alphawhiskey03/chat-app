
import moment from "moment"

export const sortUsers=(users)=>{
    let newUsers=users.sort(
        (a, b) =>{ 
          if(a.latestMessage===null){
            return 1
          }
          if(b.latestMessage===null){
            return -1
          }

          if(a.latestMessage.createdAt===b.latestMessage){
            return 0
          }
          return new Date(a.latestMessage.createdAt)<new Date(b.latestMessage.createdAt)?1:-1;
          
          })

    return newUsers
    }

export const lastMessageTime=(timestamp)=>{
    return timestamp?moment(timestamp.createdAt).fromNow():""
}
