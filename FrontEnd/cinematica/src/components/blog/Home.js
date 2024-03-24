import axios from "axios";
import { useEffect, useState } from "react";
import PostListItems from "./PostListItems";
import Navbar from "../Navbar";
import image1 from "./images/image1.jpg";
import image2 from "./images/image2.jpg";
import image3 from "./images/image3.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import checkGuest from "../auth/checkGuest";
function Home() {
    const [filteredPosts, setFilteredPosts] = useState([]);
    var user = useSelector(store=>store.auth.user);
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/cinema/').then(response => {
            setFilteredPosts(response.data);

        }).catch(error => {
            console.log("Error fetching posts:", error);
        });
       }, []);
       
    return (<div>
        <Navbar/>
        <div id="demo" className="carousel slide" data-bs-ride="carousel">

        <div className="carousel-indicators">
          <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
        </div>

        <div className="carousel-inner" style={{maxHeight:"45vh", marginTop:"20px"}}>
          <div className="carousel-item active">
            <img src={image1} alt="Screen 1" className="d-block w-100"/>
            <div className="carousel-caption" style={{marginBottom:"40px"}}>
            </div>
          </div>
          <div className="carousel-item">
            <img src={image2} alt="Screen 2" className="d-block w-100"/>
            <div className="carousel-caption" style={{marginBottom:"40px"}}>
            </div>
          </div>
          <div className="carousel-item">
          <div className="carousel-caption" style={{marginBottom:"40px"}}>
            </div>
            <img src={image3} alt="Screen 3" className="d-block w-100"/>
            
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
        </div>
        <div className="container-flex" style={{marginLeft:"10px",marginRight:"10px", marginTop:"30px"}}>
                    <div className="row">
                        
                        {filteredPosts.length !== 0 ? (
                           filteredPosts.map((post) => (
                            post.is_active == 1 && 
                            <PostListItems key={post.id} post={post}/>
                          ))
                          ) : (
              <div/>
            )}
            {user && user.email=="admin@cinematica.com"?( <div className="col-6 col-sm-4 col-md-3 col-lg-2" >
            <Link to={"/add"}>
                <div style={{ marginTop: "35px" , border:"5px solid", borderColor:"black",borderRadius:"20px", opacity:"50%", paddingBottom:"40px", paddingTop:"40px",paddingLeft:"80px"}}>
                <div style={{ overflowX: "hidden", whiteSpace: "nowrap", marginBottom: "10px" }} className="Container my-auto mx-auto">
                <span className="fa fa-plus my-auto mx-auto" style={{fontSize:"50px", color:"black", opacity:"75%" }}></span>
                </div>
                </div>
            </Link></div>):null}
                    </div>
                </div>
            </div>);
}

export default checkGuest(Home);
