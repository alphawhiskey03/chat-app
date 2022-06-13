import { useContext, createContext, useReducer } from "react";

const initialState = {
  users: [],
};

const MessagesStateContext = createContext();
const MessagesDispatchContext = createContext();

const MessagReducer = (state, action) => {
  let usersCopy,userIndex,temp;
  const { username,message, messages,reaction } = action.payload;
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_SELECTED_USER":
      usersCopy = state.users.map((user) => ({
        ...user,
        selected: user.username === action.payload,
      }));
      return {
        ...state,
        users: usersCopy,
      };
    case "SET_USER_MESSAGE":
      usersCopy = state.users;
       userIndex = usersCopy.findIndex((u) => u.username === username);
      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };
      return {
        ...state, 
        users: usersCopy,
      };
    case "ADD_MESSAGE":
      usersCopy = state.users;
       userIndex = usersCopy.findIndex((u) => u.username === username);
        temp={
         ...usersCopy[userIndex],
         messages:[
          {...message,message_reactions:[]},
          ...usersCopy[userIndex].messages,
         ],
         latestMessage:message,
       }
       usersCopy[userIndex]=temp;

       return {
         ...state,
         users:usersCopy
       }
    case "ADD_REACTION":
      usersCopy = state.users;
      userIndex = usersCopy.findIndex((u) => u.username === username);

      temp={...usersCopy[userIndex]}
      const messageIndex=temp.messages?.findIndex(m=>m._id===reaction.message._id)
      if(messageIndex > -1){
        let messageCopy=[...temp.messages]
        let reactionsCopy=[...messageCopy[messageIndex].message_reactions]
      
        const reactionIndex=reactionsCopy.findIndex(r=>r._id===reaction._id)

        if(reactionIndex > -1){
          reactionsCopy[reactionIndex]=reaction
        }else{
          let message_reactions=reaction
          reactionsCopy=[...reactionsCopy,message_reactions]
        }

        messageCopy[messageIndex]={
          ...messageCopy[messageIndex],
          message_reactions:reactionsCopy
        }

        temp={...temp,messages:messageCopy}
        usersCopy[userIndex]=temp
      }

      return {
        ...state,
        
      }
      case "LOGOUT":
        return {
          ...state,
          users:null
        }



    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MessagReducer, initialState);
  return (
      <MessagesDispatchContext.Provider value={dispatch}>
            <MessagesStateContext.Provider value={state}>

        {children}
        </MessagesStateContext.Provider>
      </MessagesDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessagesStateContext);
export const useMessageDispatch = () => useContext(MessagesDispatchContext);
