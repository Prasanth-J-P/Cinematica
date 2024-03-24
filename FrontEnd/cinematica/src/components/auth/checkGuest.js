import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate , useLocation } from "react-router-dom"
export const checkGuest = (Component) =>{
    function Wrapper(props){
        var location=useLocation();
        var user = useSelector(store=>store.auth.user);
        var navigate = useNavigate();
        useEffect(()=>{
            if(!user){
                navigate(location);
            }
            else{
                navigate('/')
            }
        },[user])
            
        return  <Component {...props}/>;
    }
    return Wrapper;
}

export default checkGuest;