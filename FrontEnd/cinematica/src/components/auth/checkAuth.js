import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const checkAuth = (Component) =>{
    function Wrapper(props){
        var location=useLocation();
        var user = useSelector(store=>store.auth.user);
        var navigate = useNavigate();
        useEffect(()=>{
            if(user){
                navigate(location);
            }
            else navigate('/login');
        },[user]);
        return <Component {...props}/>;
    }
    return Wrapper;
}

export default checkAuth;