import {Navigate } from "react-router-dom";
import { useAuthState } from "./auth.util";
const CheckRoute = (props) => {
    const {user}=useAuthState()
    if(!user && props.authenticated){
        return <Navigate to="/login"/>
    }
    if(user && props.guest){
        return <Navigate to="/"/>
    } 
    return props.children
}
 
export default CheckRoute;