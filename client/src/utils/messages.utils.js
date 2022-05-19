import { useContext, createContext, useReducer } from "react";

const initialState = {
  users: null,
};

const MessagesStateContext = createContext();
const MessagesDispatchContext = createContext();

const MessagReducer = (state, action) => {
  let usersCopy;
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
      const { username, messages } = action.payload;
      const userIndex = usersCopy.findIndex((u) => u.username === username);
      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };
      return {
        ...state,
        users: usersCopy,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MessagReducer, initialState);
  return (
    <MessagesStateContext.Provider value={state}>
      <MessagesDispatchContext.Provider value={dispatch}>
        {children}
      </MessagesDispatchContext.Provider>
    </MessagesStateContext.Provider>
  );
};

export const useMessageState = () => useContext(MessagesStateContext);
export const useMessageDispatch = () => useContext(MessagesDispatchContext);
