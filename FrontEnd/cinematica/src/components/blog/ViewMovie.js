import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import checkGuest from "../auth/checkGuest";

function ViewMovie() {
    let navigate = useNavigate();
    var { postId } = useParams()
    var [post, setPost] = useState({ name: '', description: '', language: '', rel_date: '', duration: '', trailer: '' })
    var user = useSelector(store => store.auth.user);

    function DeletePost() {
        axios.delete('http://127.0.0.1:8000/cinema/delete/' + post.id, {
            headers: { 'Authorization': "Token " + user.token }
        }).then(response => {
            alert(response.data);
            navigate("/");
        }).catch(error => {
            alert(error.error)
        });
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/cinema/' + postId).then(response => {
            setPost(response.data);
        });
    }, [postId]);

    return (
        <div>
            <Navbar />
            <div className="container-flex" style={{ background: "#323131", padding: "10px", height: "100%", minHeight:"100vh" }}>
                <div className="row" style={{ marginTop: "10px", marginLeft: "10px", color: "white" }}>
                    <div className="col-md-6">
                        <iframe width="100%" height="360" src={post.trailer} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div className="col-md-6" >
                        <div className="card" style={{ background: "#323131", minHeight: "360px" }}>
                            <div className="card-header"><h3>{post.name}</h3></div>
                            <div className="card-body">
                                <p>{post.description}</p>
                                <p>{post.language}</p>
                                <p>{post.rel_date}</p>
                                <p>{post.duration} min</p>
                                {post.is_active == 1 ? (<Link to={"/book/" + post.id} className="btn btn-danger" style={{ borderRadius: "10px", marginRight: "10px", width: "100%" }}>Book Ticket<span className="fa fa-ticket"></span></Link>) : null}
                                {user && user.email == "admin@cinematica.com" ? (<Link to={"/list/" + post.id + "/edit"} className="btn btn-warning" style={{ marginTop: "5px", textAlign: "center", width: "100%" }}>Edit&nbsp;&nbsp;<span className="fa fa-edit"></span></Link>) : null}
                                {user && user.email == "admin@cinematica.com" && post.is_active == 1 ? (<button onClick={DeletePost} className="btn btn-danger" style={{ marginTop: "5px", textAlign: "center", width: "100%" }}>Deactivate</button>) : null}
                                {user && user.email == "admin@cinematica.com" && post.is_active == 0 ? (<button onClick={DeletePost} className="btn btn-danger" style={{ marginTop: "5px", textAlign: "center", width: "100%" }}>Activate</button>) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkGuest(ViewMovie);
