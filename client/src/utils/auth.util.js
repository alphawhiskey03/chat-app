import { useReducer, createContext, useContext } from "react";

import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};
const AuthStateContext = createContext();
const AuthReducerContext = createContext();

let token = localStorage.getItem("token");
if (token) {
  let decodedToken = jwtDecode(token);

  if (Date.now() > decodedToken.exp * 1000) {
    localStorage.removeItem("token");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, { ...initialState });
  return (
    <AuthStateContext.Provider value={state}>
      <AuthReducerContext.Provider value={dispatch}>
        {children}
      </AuthReducerContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthReducerContext);
