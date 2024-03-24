import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import checkAdmin from "../auth/checkAdmin";

function ListMovie() {
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/cinema/')
            .then(response => {
                setFilteredPosts(response.data);
            })
            .catch(error => {
                console.log("Error fetching posts:", error);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <div className="list-group" style={{ marginLeft: "10px", marginRight: "10px", marginTop: "30px", textAlign: "center" }}>
                {filteredPosts.map((post) => (
                    post.is_active == 1 ? (
                        <div key={post.id} className="list-group-items list-group-item-success" style={{ border: "solid 1px black", marginBottom: "5px", paddingTop:"5px" }}>
                            <Link to={"/view/" + post.id} style={{ textDecoration: "none" }}>
                                <h5 style={{ textDecoration: "none", color: "black" }}>{post.name}</h5>
                            </Link>
                        </div>
                    ) : (
                        <div key={post.id} className="list-group-items list-group-item-dark" style={{ border: "solid 1px black", marginBottom: "5px",paddingTop:"5px"  }}>
                            <Link to={"/view/" + post.id} style={{ textDecoration: "none" }}>
                                <h5 style={{ textDecoration: "line-through 1px", color: "black" }}>{post.name}</h5>
                            </Link>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default checkAdmin(ListMovie);
