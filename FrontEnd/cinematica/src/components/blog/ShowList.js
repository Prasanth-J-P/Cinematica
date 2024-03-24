import React from "react";
import checkAdmin from "../auth/checkAdmin";
import Navbar from "../Navbar";
import axios from "axios";
import { useEffect , useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
function ShowList(){
    const [name, setName] = useState([]);
    const [slots, setSlots] = useState([]);
    const [screen, setScreen] = useState([]);
    const [show, setShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentDate = new Date();
    const NowDate = currentDate.toISOString().split("T")[0];
    const navigate = useNavigate();
    var location=useLocation();
    const user = useSelector(store => store.auth.user);

    useEffect(() => {   
        
        const fetchData1 = async () => { 
            try {
              const [response1, response2,response3,response4] = await Promise.all([
        axios.get('http://127.0.0.1:8000/cinema/listslots',{headers:{'Authorization':"Token "+ user.token}}),
        axios.get('http://127.0.0.1:8000/cinema/listscreen',{headers:{'Authorization':"Token "+ user.token}}),
        axios.get('http://127.0.0.1:8000/cinema/listshows',{headers:{'Authorization':"Token "+ user.token}}),
        axios.get('http://127.0.0.1:8000/cinema/')])
            setSlots(response1.data);
            setScreen(response2.data);
            setShow(response3.data);
            console.log(response3.data)
            setName(response4.data);
            setLoading(false);
    } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        };
    
        fetchData1();
    },[user]);
    return(
        <div>
        {loading ? (
        <div className="center-div" style={{textAlign:"center",marginTop:"30vh"}}>
        <div className="spinner-grow text-primary"></div>
        <div className="spinner-grow text-success"></div>
        <div className="spinner-grow text-info"></div>
        <div className="spinner-grow text-warning"></div>
        <div className="spinner-grow text-danger"></div>
        <div className="spinner-grow text-secondary"></div>
        <div className="spinner-grow text-dark"></div>
        <div className="spinner-grow text-light"></div>
        </div>
      ) : (
        <div> 
            <Navbar/>
            <h1 style={{textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 2px 0 black"}}><b>Show List</b></h1>
            <table class="table table-hover table-striped container" style={{color:"#C44327"}}>
            <thead>
                    <tr>
                    <th scope="col">MOVIE</th>
                    <th scope="col">SCREEN</th>
                    <th scope="col">TIME</th>
                    <th scope="col">FROM</th>
                    <th scope="col">TO</th>
                    <th scope="col">CAPACITY</th>
                    </tr>
                </thead>
                <tbody>
            {show.length>0?(
             show.map((showId) => showId && showId.To >NowDate?( 
                <tr>
                 {name.length > 0?(
                  name.map((nameId) =>
                  nameId.id == showId.name ? (
                    <td key={showId}>{nameId.name}</td>
                  ) : null)): <td key={showId}>{showId.name}</td>}
                {screen.length > 0?(
                  screen.map((screenId) =>
                  screenId.id === showId.screen ? (
                    <td key={showId}>{screenId.screen}</td>
                  ): null)) : <td key={showId}>{showId.screen}</td>
                }
               {slots.length > 0?(
                  slots.map((slotsId) =>
                  slotsId.id === showId.slot ? (
                    <td key={showId} >{slotsId.time}</td>
                  ): null)) : <td key={showId}>{showId.slot}</td>
                }
                <td key={showId}>{showId.From}</td>
                <td key={showId}>{showId.To}</td>
                {screen.length > 0?(
                  screen.map((screenId) =>
                  screenId.id === showId.screen ? (
                    <td key={showId}>{screenId.capacity}</td>
                  ): null)) : <td key={showId}>{showId.comp_capacity}</td>
                }
              </tr>
            
           ):null)):(<tr><td colSpan={6} style={{textAlign:"center"}}><span className="fa fa-frown-o" style={{fontSize:"90px", color:"#C44327"}}></span><div>No Shows available</div>
              </td>
              </tr>)}
              </tbody></table></div>)}
</div>
)}
export default checkAdmin(ShowList);