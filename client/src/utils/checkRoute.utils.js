import { Route,Navigate } from "react-router-dom";
import Login from "../pages/login,page";
import { useAuthState } from "./auth.util";
const CheckRoute = (props) => {
    const {user}=useAuthState()
    console.log(user)
    if(!user && props.authenticated){
        return <Navigate to="/login"/>
    }
    if(user && props.guest){
        console.log(user)
        return <Navigate to="/"/>
    } 
    return props.children
}
 
export default CheckRoute;