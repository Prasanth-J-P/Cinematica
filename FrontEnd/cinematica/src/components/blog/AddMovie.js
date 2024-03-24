import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import checkAdmin from "../auth/checkAdmin";
import { useSelector } from "react-redux";

function AddMovie() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [rel_date, setRel_Date] = useState('');
    const [image, setImage] = useState(null); 
    const [duration, setDuration] = useState(0);
    const [trailer, setTrailer] = useState('');
    const navigate = useNavigate();
    const user = useSelector(store => store.auth.user);

    function addMovie() {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('language', language);
        formData.append('rel_date', rel_date);
        formData.append('image', image);
        formData.append('duration', duration);
        formData.append('trailer', trailer);

        if (user) {
            axios.post('http://127.0.0.1:8000/cinema/create', formData, {
                headers: {
                    'Authorization': 'Token ' + user.token,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                    navigate('/list/' + response.data.id + '/view');
                    alert('Movie added');
                }).catch(error => {
                    console.error('Error adding movie:', error);
                    alert('Failed to add movie');
                });
        } else {
            navigate('/');
        }
    }

    return (
        <div>
            <Navbar />
            <h1 style={{textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 2px 0 black"}}><b>Add Movies</b></h1>
            <div className="container" style={{ width: "60%", marginTop: "10px", borderStyle: "ridge", borderColor: "black", borderWidth: "1px", borderRadius: "0", background:"#C44327" }}>
                <div className="row">
                    <div className="col-12" >
                        <form className="form" encType="multipart/form-data" style={{ lineHeight:"30px", marginTop:"20px"}}>
                        <div className="form-floating mb-3">
                            <input type="text" className='form-control' style={{ borderRadius:"20px"}}  placeholder="Name...." value={name} onChange={(event) => { setName(event.target.value) }} />
                            <label for="floatingInput">Movie Name...</label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea className='form-control' style={{borderRadius:"20px"}} placeholder="Description...." value={description} onChange={(event) => { setDescription(event.target.value) }} />
                            <label for="floatingInput">Movie Description...</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className='form-control'  style={{ borderRadius:"20px"}} placeholder="Language...." value={language} onChange={(event) => { setLanguage(event.target.value) }} />
                            <label for="floatingInput">Language...</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" className='form-control'  style={{borderRadius:"20px"}} placeholder="Duration...." min={0} value={duration} onChange={(event) => { setDuration(event.target.value) }} />
                            <label for="floatingInput">Duration...</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="url" className='form-control'  style={{ borderRadius:"20px"}} placeholder="Trailer link...." value={trailer} onChange={(event) => { setTrailer(event.target.value) }} />
                            <label for="floatingInput">Trailer URL...</label>
                        </div>
                        <div className='row mb-3'>
                        <div className="form-floating col-sm-6">
                            <input type="date" className='form-control'  style={{ borderRadius:"20px"}} placeholder="...." value={rel_date} onChange={(event) => { setRel_Date(event.target.value) }} />
                            <label for="floatingInput">Release Date...</label>
                        </div >
                        <div className="form-floating col-sm-6">
                            <input type="file" className='form-control'  style={{borderRadius:"20px"}} onChange={(event) => { setImage(event.target.files[0]) }} />
                            <label htmlFor="floatingInput">Choose Image</label>
                        </div></div>
                        <div className="form-group" style={{textAlign:"center"}}>
                            <button className="btn btn-primary" style={{width:"100%"}} onClick={addMovie}>Add</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default checkAdmin(AddMovie);
