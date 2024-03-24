import checkAuth from "../auth/checkAuth";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function MyBookingsList(){
    const [bookings,setBookings]=useState([])
    var user = useSelector((store) => store.auth.user);
    const [loading, setLoading] = useState(true);
    const user_mail = user ? user.email : '';
    useEffect(() => {
        if(user_mail) {
        axios.get('http://127.0.0.1:8000/cinema/mybookings/'+user_mail, { headers: { 'Authorization': "Token " + user.token } }).then(response => {
            setBookings(response.data);
            setLoading(false)
        }).catch(error => {
            console.log("Error fetching posts:", error);
        });}
       }, [user_mail]);
    return(
        <div>
           {loading ? (
        <div className="center-div" style={{textAlign:"center"}}>
        <div className="spinner-grow text-primary"></div>
        <div className="spinner-grow text-success"></div>
        <div className="spinner-grow text-info"></div>
        <div className="spinner-grow text-warning"></div>
        <div className="spinner-grow text-danger"></div>
        <div className="spinner-grow text-secondary"></div>
        <div className="spinner-grow text-dark"></div>
        <div className="spinner-grow text-light"></div>
        </div>
      ) : (<div>
          <div className="container-flex" style={{marginTop:"10px"}}>
          {bookings.map((post) => (
            post.payment_status == 1 ? (
          <div key={post.id} className="list-group-items list-group-item-success" style={{ border: "solid 1px black", marginBottom: "5px", paddingTop:"5px", borderRadius:"5px"}}>
                            <Link to={"/mybookings/" + post.id} style={{ textDecoration: "none" }} target="_blank">
                                <div className="row">
                                    <div className="col-6 my-auto" style={{ textDecoration: "none", color: "black", paddingLeft:"20px" }}>
                                        <h6>{post.movie_name}</h6><p>{post.date}</p> <p>{post.slotdetails}</p>
                                    </div>
                                    <div className="col-6 my-auto">
                                        <a  href={'http://127.0.0.1:8000'+post.booking_pdf} download target="_blank" style={{float:"right", paddingRight:"5px",color:"#C44327"}}><i className="fa fa-download" style={{fontSize:"24px"}}></i></a>
                                    </div>
                                </div>
                            </Link>
   
                        </div>):null))}
                        </div>
                        
        </div>)}</div>
    )
}
export default checkAuth(MyBookingsList);