import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import React from "react";
import checkAdmin from "../auth/checkAdmin";
import { useSelector } from "react-redux";
function EditMovie() {
    const {postId} = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [rel_date, setRel_Date] = useState('');
    const [image, setImage] = useState('');
    const [duration, setDuration] = useState(0);
    const [trailer, setTrailer] = useState('');
    let navigate = useNavigate();
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/cinema/'+postId).then(response=>{
            setName(response.data.name);
            setDescription(response.data.description);
            setLanguage(response.data.language);
            setRel_Date(response.data.rel_date);
            setImage(response.data.image);
            setDuration(response.data.duration);
            setTrailer(response.data.trailer);
        })
    },[postId]);
    function updatePost(){
        axios.put('http://127.0.0.1:8000/cinema/update/'+postId,{
            name: name,
            description: description,
            language: language,
            rel_date:rel_date,
            image:image,
            duration:duration,
            trailer: trailer
        },{headers:{'Authorization':"Token "+ user.token}}).then(response=>{
            navigate('/list/'+postId+'/view');
           alert("Update Successful......");
           
        }).catch(error=>{
            alert(error)
        })
    }
      var user = useSelector(store=>store.auth.user);
    return <div>
        <Navbar/>
        <h1 style={{textAlign:"center", marginTop:"20px"}}><b>Edit Movie</b></h1>
        <div className="container" style={{ padding: "0", width: "60%", height: "130%", marginTop: "10px", borderStyle: "solid", borderColor: "black", borderWidth: "1px", borderRadius: "0", overflow: "hidden" }}>
            <div className="row" style={{ padding: "0" }}>
                <div className="col-12" style={{textAlign:"center"}}>
                <div style={{textAlign:"center" , lineHeight:"30px", marginTop:"40px", marginBottom:"40px"}}>
                    <div className="form-group">
                        <input type="text" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} value={name} onChange={(event)=>{setName(event.target.value)}}/>
                    </div>
                    <div className="form-group">
                        <textarea style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}}  value={description} onChange={(event)=>{setDescription(event.target.value)}}
                        />
                    </div>
                    <div className="form-group">
                        <input style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} type="text" value={language} onChange={(event)=>{setLanguage(event.target.value)}}/>
                    </div>
                    <div className="form-group">Release date:
                            <input type="date" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}}  value={rel_date} onChange={(event) => { setRel_Date(event.target.value) }} />
                        </div>
                        <div className="form-group">Image:
                            <input type="file" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} onChange={(event) => { setImage(event.target.value) }} />
                        </div>
                        <div className="form-group">Duration:
                            <input type="number" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} value={duration} onChange={(event) => { setDuration(event.target.value) }} />
                        </div>
                        <div className="form-group">
                            <input type="url" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} value={trailer} onChange={(event) => { setTrailer(event.target.value) }} />
                        </div>
                    <div className="form-group">
                        <button className="btn btn-primary" style={{width:"75%"}} onClick={updatePost}>Submit</button>
                    </div> 
                    </div>                   
                </div>
            </div>
        </div>
    </div>
}

export default checkAdmin(EditMovie);