import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import checkAdmin from "../auth/checkAdmin";
import { useSelector } from "react-redux";

function AddShow() {
    const [name, setName] = useState([]);
    const [slots, setSlots] = useState([]);
    const [screen, setScreen] = useState([]);
    const [nameid, setNameid] = useState(0);
    const [slotid, setSlotid] = useState(0);
    const [screenid, setScreenid] = useState(0);
    const [from_date, setFrom_Date] = useState('');
    const [to_date, setTo_Date] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useSelector(store => store.auth.user);
    
    useEffect(() => {   
        const fetchData1 = async () => { 
            try {
              const [response1, response2,response3] = await Promise.all([
        axios.get('http://127.0.0.1:8000/cinema/listslots',{headers:{'Authorization':"Token "+ user.token}}),
        axios.get('http://127.0.0.1:8000/cinema/listscreen',{headers:{'Authorization':"Token "+ user.token}}),
        axios.get('http://127.0.0.1:8000/cinema/')])
            setSlots(response1.data);
            setScreen(response2.data);
            setName(response3.data);
            setLoading(false);
    } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        };
    
        fetchData1();
    },[]);
      
    function addShow() {
            axios.post('http://127.0.0.1:8000/cinema/addshow',{
                name: nameid,
                screen: screenid,
                slot: slotid,
                From:from_date,
                To:to_date,
                comp_capacity:0
            }, {
                headers: {
                    'Authorization': 'Token ' + user.token,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                    navigate('/list');
                    alert('show added');
                }).catch(error => {
                    console.error('Error adding movie:', error);
                    alert('Failed to add movie');
                });
       
    }

    return (
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
            <h1 style={{textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 2px 0 black"}}><b>Add Shows</b></h1>
            <div className="container" style={{ width: "60%", marginTop: "10px", borderStyle: "ridge", borderColor: "black", borderWidth: "1px", borderRadius: "0", background:"#C44327" }}>
                <div className="row">
                    <div className="col-12" >
                        <form className="form" encType="multipart/form-data" style={{textAlign:"center" , lineHeight:"30px", paddingTop:"10px"}}>
                        <div className='row'>
                        <div className="col-sm-4" >
                        <select id="name" name="name" className='form-select form-select-sm mb-3' value={nameid} onChange={(event) => { setNameid(event.target.value) }}>
                        <option value="null">Choose Movie</option>
                        {name.map((post) => (
                          post.is_active == 1 && (
                            <option key={post.id} value={post.id} >{post.name}</option>)))}
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
                        <div className='row mb-3'>
                        <div className="form-floating col-sm-6 mt-3">
                            <input type="date" className='form-control' style={{ borderRadius:"20px"}} placeholder="...." value={from_date} onChange={(event) => { setFrom_Date(event.target.value) }} />
                            <label for="floatingInput">From</label>
                        </div>
                        <div className="form-floating col-sm-6 mt-3">
                            <input type="date" className='form-control' style={{borderRadius:"20px"}} placeholder="...." value={to_date} onChange={(event) => { setTo_Date(event.target.value) }} />
                            <label for="floatingInput">To</label>
                        </div></div>
                        <div className="form-group" style={{textAlign:"center"}}>
                            <button className="btn btn-primary" style={{width:"100%"}} onClick={addShow}>Add</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>)}
        </div>
    );
}


export default checkAdmin(AddShow);
