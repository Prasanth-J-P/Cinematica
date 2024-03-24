import Navbar from "../Navbar"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";
function MyBookings() {
    const { postId } = useParams();
    const [booking, setBooking] = useState({});
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/cinema/mybooking/' + postId).then(response => {
            setBooking(response.data[0]);

        }).catch(error => {
            console.log("Error fetching posts:", error);
        });
    }, []);

    return (
        <div style={{ backgroundColor: "rgba(233, 233, 233, 0.897)", margin:"0",padding:"0", paddingBottom:"10vh" }}>
            <Navbar />
                <div className="container" >
                    <div className="row" style={{ textAlign: "center", marginBottom: "5vh", marginTop: "5vh" }}>
                        <h3>Your Ticket</h3>
                    </div>
                    <div className="row" style={{border:"solid 2px black" , backgroundColor:"white"}}>
                        <div className="col-4" style={{ padding: "5px", borderRight:"dashed 1px black" }}>
                            <img src={'http://127.0.0.1:8000/media/' + booking.image} alt={booking.movie_name} style={{ width: "100%", objectFit: "contain", borderRadius: "20px" }} className="img-thumbnail"></img>
                        </div>
                        <div className="col-8">
                            <div className="container-flex">
                            <div className="row" style={{ borderBottom:"dashed 1px black", margin:"0px", padding:"2vh"}}>
                                <h3 style={{textAlign:"center"}}>{booking.movie_name}</h3>
                                <h6 style={{textAlign:"center"}}>{booking.language}</h6>
                                <span className="h5" >{booking.date} | {booking.slotdetails} <span style={{float:"right"}}>Cinematica,HSR layout</span></span>
                                
                            </div>
                            <div className="row" style={{backgroundColor:"rgba(233, 233, 233, 0.897)", margin:"10px", borderRadius:"20px", padding:"5px"}}>
                                <div className="col-6 my-auto mx-auto">
                                    <h6>{booking.tktcount} Ticket(s)</h6>
                                    <h3>Screen {booking.screen} </h3>
                                    <h6>{booking.seat}</h6>
                                    <h4>Booking ID {booking.id}</h4>
                                </div>
                                <div className="col-6 my-auto mx-auto">
                                     <img src={'http://127.0.0.1:8000' + booking.booking_qr} alt={booking.movie_name} style={{objectFit: "contain", height:"75%",width:"75%" }} className="img-thumbnail"></img>
                                </div>
                                </div>
                            <div className="row">
                                <p>Cancellation is not applicable. A confirmation mail has been sent to your email adress</p>
                            </div>
                            
                        </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}
export default MyBookings;
