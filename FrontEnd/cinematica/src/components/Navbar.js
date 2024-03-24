import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { useSelector , useDispatch} from "react-redux";
import { removeUser } from "../store/authSlice";
import MyBookingsList from "./blog/MyBookingsList";
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function logout(){  //Logout function
          axios.post('http://127.0.0.1:8000/cinema/logout',{},{headers:{'Authorization':"Token "+ user.token}
          });
          dispatch(removeUser());
          navigate('/login');
          setTimeout(() => {
            alert("You are Successfully logged out....!!!");
        }, 500);
       
      }
  
  var user = useSelector(store=>store.auth.user);

  return <div>
          <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="3" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div class="offcanvas-header">
              <h4 id="offcanvasWithBothOptionsLabel" style={{textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 0px 0 black"}}>My Bookings</h4>
              <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <MyBookingsList/>
            </div>
          </div>  
      <nav className="navbar navbar-expand-md navbar-dark customnav comntainer-flex" style={{background:"#C44327 ", zIndex:"1", padding:"10px"}}>
        <a className="navbar-brand" style={{marginLeft:"5px"}} href="/"><span className="fa fa-video-camera"></span>CINEMATICA</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target='#navbar , #navbar2'><span className="navbar-toggler-icon"></span></button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to={"/"} className="nav-link">
                Home
              </NavLink>
            </li>
            {user?(
            <li>
            <NavLink to={"/mybookings"} className="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" >
              My bookings
            </NavLink>
            </li>):null}
            </ul>
        </div>
        {!user?(<span ><NavLink to={"/login"} style={{color:"white",color:"white", float:"right",textDecoration:"none"}}>Login</NavLink></span>):null}
        {user?(<span ><NavLink onClick={logout} ><i className="fa fa-sign-out" style={{fontSize:"24px",color:"white", float:"right"}}></i></NavLink></span>):null}
      </nav>
      {user && user.email=="admin@cinematica.com"?(<nav className="navbar navbar-expand-md navbar-dark customnav" style={{background:"#C44327 ", zIndex:"2"}}>
      <div className="collapse navbar-collapse" id="navbar2">
        <ul className="navbar-nav mr-auto">
        <li className="nav-item">
            <NavLink to={"/list"} className="nav-link">
              List Movie
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/add"} className="nav-link">
              Add Movie
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/addshow"} className="nav-link">
              Add Show
            </NavLink>
          </li> 
          <li className="nav-item">
            <NavLink to={"/listshow"} className="nav-link">
              List Show
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={"/bookingdetails"} className="nav-link">
              Booking Details
            </NavLink>
          </li>     
          </ul>
          </div>
        </nav>):null}

  </div>
}
export default Navbar;