import { useEffect } from "react";
import checkAdmin from "../auth/checkAdmin"
import Navbar from "../Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
function BookingDetails(){
    const [name, setName] = useState([]);
    const [slots, setSlots] = useState([]);
    const [screen, setScreen] = useState([]);
    const [nameid, setNameid] = useState(0);
    const [slotid, setSlotid] = useState(0);
    const [screenid, setScreenid] = useState(0);
    const [from_date, setFrom_Date] = useState('');
    const [to_date, setTo_Date] = useState('');
    const [date, setDate] = useState(''); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useSelector(store => store.auth.user);
    
    useEffect(() => {  
        axios.get('http://127.0.0.1:8000/cinema/')
        .then(response => {
            setName(response.data);
        })
        .catch(error => {
            console.log("Error fetching posts:", error);
        }); 
      
    },[]);
    useEffect(() => {  
        axios.get('http://127.0.0.1:8000/cinema/listshows/'+nameid,{headers:{'Authorization':"Token "+ user.token}})
        .then(response => {
            setScreen(response.data);
        })
        .catch(error => {
            console.log("Error fetching posts:", error);
        }); 
      
    },[nameid]);
    useEffect(() => {  
        axios.get('http://127.0.0.1:8000/cinema/listshows/'+nameid+'/'+screenid,{headers:{'Authorization':"Token "+ user.token}})
        .then(response => {
            setSlots(response.data);
        })
        .catch(error => {
            console.log("Error fetching posts:", error);
        }); 
      
    },[screenid]);
    useEffect(() => {  
        axios.get('http://127.0.0.1:8000/cinema/listshows/'+nameid+'/'+screenid+'/'+slotid ,{headers:{'Authorization':"Token "+ user.token}})
        .then(response => {
            setName(response.data);
        })
        .catch(error => {
            console.log("Error fetching posts:", error);
        }); 
      
    },[slotid]);

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
        <Navbar />
        <h1 style={{textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 2px 0 black"}}><b>Booking Details</b></h1>
        <div className="container" style={{ width: "60%", marginTop: "10px", borderStyle: "ridge", borderColor: "black", borderWidth: "1px", borderRadius: "0", background:"#C44327" }}>
            <div className="row">
                <div className="col-12" >
                    <form className="form" encType="multipart/form-data" style={{textAlign:"center" , lineHeight:"30px", paddingTop:"10px"}}>
                    <div className='row'>
                    <div className="col-sm-4" >
                    <select id="name" name="name" className='form-select form-select-sm mb-3' value={nameid} onChange={(event) => { setNameid(event.target.value) }}>
                    <option value="null">Choose Movie</option>
                    {name.map((post) => (
                    <option key={post.id} value={post.id} >{post.name}</option>))}
                    </select></div>
                    <div className="col-sm-4" >
                    <select id="screen" name="screen" className='form-select form-select-sm mb-3' value={screenid} onChange={(event) => { setScreenid(event.target.value)}}>
                    <option value="null">Choose Screen:</option>
                    {screen.map((post) => (
                        <option key={post.id} value={post.id}>{post.screen}</option>))}
                    </select></div>
                    <div className="col-sm-4" >
                    <select id="slot" name="slot" className='form-select form-select-sm' value={slotid} onChange={(event) => { setSlotid(event.target.value) }}>
                    <option value="null">Choose Slot</option>
                    {slots.map((post) => (
                        <option key={post.id} value={post.id}>{post.slot}</option>))}
                    </select></div></div>
                    <div className="form-floating col-12">
                        <input type="date" className='form-control' style={{borderRadius:"20px",marginBottom:"10px"}} placeholder="...." value={date} onChange={(event) => { setDate(event.target.value) }} />
                        <label for="floatingInput">Date</label>
                    </div>
                    <div className="form-group" style={{textAlign:"center"}}>
                        <button className="btn btn-primary" style={{width:"100%"}}>Check Bookings</button>
                    </div>
                </form>


        </div></div></div></div>
    )
}</div>)
}
export default checkAdmin(BookingDetails);





