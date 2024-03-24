import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function PostListItems(props) {
    const navigate=useNavigate();
    var user = useSelector(store=>store.auth.user);

    return (
        <div className="col-6 col-sm-4 col-md-3 col-lg-3" style={{ marginBottom: "30px" }}>
            <Link to={"/view/" + props.post.id} style={{textDecoration:"none"}}>
            <div style={{ overflowX: "hidden", whiteSpace: "nowrap", marginBottom: "10px" }}><b style={{textDecoration:"none",color:"black"}} >{props.post.name}</b><br /></div>
            <img src={'http://127.0.0.1:8000'+props.post.image} alt={props.post.name} style={{ width: "100%", objectFit: "contain", borderRadius: "20px", borderBlockColor: "black" }} className="img-thumbnail"></img>
            </Link> 
        </div>
    )
}
export default PostListItems;