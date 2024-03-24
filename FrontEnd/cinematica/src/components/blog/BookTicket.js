import checkAuth from "../auth/checkAuth";
import Navbar from "../Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function BookTicket() {
    const { postId } = useParams();
    const [filteredPosts, setFilteredPosts] = useState([]);
    var [post, setPost] = useState({ name: '', description: '', language: '', rel_date: '', duration: '', trailer: '' })
    var [screen, setScreen] = useState([])
    var [slot, setSlot] = useState([])
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(true);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; 
    useEffect(() => {
        const fetchData1 = async () => { 
            try {
              const [response1, response2] = await Promise.all([
        axios.get('http://127.0.0.1:8000/cinema/listshow/' + postId, { headers: { 'Authorization': "Token " + user.token } }),
        axios.get('http://127.0.0.1:8000/cinema/' + postId)])
        setFilteredPosts(response1.data);
        setPost(response2.data);
        setLoading(false);
    } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        };
    
        fetchData1();
    }, [postId]);
    useEffect(() => {
        const fetchData2 = async () => {
            try {
              const [response3, response4] = await Promise.all([
        axios.get('http://127.0.0.1:8000/cinema/listscreen' , { headers: { 'Authorization': "Token " + user.token } }),
        axios.get('http://127.0.0.1:8000/cinema/listslots' , { headers: { 'Authorization': "Token " + user.token } })])
        setScreen(response3.data);
        setSlot(response4.data);
        setWaiting(false);
            } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        };
    
        fetchData2();

    },[]);
    var user = useSelector(store => store.auth.user);
    return (
        <div>
            {loading && waiting ? (
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
                <h1 style={{textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 2px 0 black"}}>{post.name}-{post.language}</h1>
                <div className="container justify-content-center mx-auto" style={{ marginTop: "30px" }}>
                <div className="row">
                    {filteredPosts.filter(post => post.To >= formattedDate).map(post => (
                                <span className="card" style={{ width: "23%", marginBottom: "10px", borderStyle: "ridge", borderWidth: "1px", borderColor: "green", color: "black", textDecoration: "none", marginRight:"5px" }}>
                                <Link to={"/addbookings/" + post.id} key={post.id} style={{ textDecoration: "none", color: "black" }}>
                                    <div className="card-body">
                                        {screen.length > 0 && screen.map((screenId) => (
                                            (screenId.id === post.screen) ? (<div className="card-title">Screen : {screenId.screen}</div>) : null))}
                                        {slot.length > 0 && slot.map((slotId) => (
                                            (slotId.id === post.slot) ? (<div className="card-title">{slotId.time}</div>) : null))}
                                    </div>
                                </Link>
                                </span>
                        ))}
                </div>

                </div></div>)}
                </div>

    )
}
export default checkAuth(BookTicket); 