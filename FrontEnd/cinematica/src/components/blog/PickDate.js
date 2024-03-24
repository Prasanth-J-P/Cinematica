import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import checkAuth from "../auth/checkAuth";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
function PickDate() {
  const { postId } = useParams();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPost] = useState([]);
  const [screen, setScreen] = useState([]);
  const [slot, setSlot] = useState([]);
  const navigate = useNavigate();
  const [From, setFromDate] = useState("");
  const [to, setToDate] = useState("");
  const [date, setDate] = useState("");
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [tkt, setTkt] = useState(1);
  const [tktcnt, setTicketCount] = useState(0);
  const [tktlft, setTicketLeft] = useState(0);
  var user = useSelector((store) => store.auth.user);
  var location = useLocation();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
 function paymentgateway(data) {
    console.log(data)
    console.log(user.email);
    const formData = {
      'show': data[0]['id'],
      'date': date,
      'user': user.email,
      'ticket': tkt,
      'tktcnt' : tktcnt
    };
    console.log(formData);
    axios.post("http://127.0.0.1:8000/cinema/paymentportal", formData, {
      headers: { Authorization: "Token " + user.token },
    }).then((res) => {
      var options = {
        key: res.data.razorpay_key,
        amount: res.data.order.amount,
        currency: res.data.order.currency,
        callback_url: res.data.callback_url,
        product_name: res.data.slot,
        prefill: {
          email: user.email,
          contact: "1234567890",
        },
        order_id: res.data.order.id,
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.open();

    }).catch((err) => {
      alert("Payment gateway error...Please retry!!!!");
      navigate('/');
    });
  }

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const [response1, response2, response3, response4] = await Promise.all([
          axios.get("http://127.0.0.1:8000/cinema/listshow/bookshow/" + postId, { headers: { Authorization: "Token " + user.token } }),
          axios.get("http://127.0.0.1:8000/cinema/listscreen", { headers: { Authorization: "Token " + user.token } }),
          axios.get("http://127.0.0.1:8000/cinema/listslots", { headers: { Authorization: "Token " + user.token } }),
          axios.get("http://127.0.0.1:8000/cinema/")])
        setFilteredPosts(response1.data);
        setFromDate(response1.data[0].From);
        setToDate(response1.data[0].To);
        setScreen(response2.data);
        setSlot(response3.data);
        setPost(response4.data);
        setLoading(false);
      }
      catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        navigate(location);
      }
    };

    fetchData1();
  });

  useEffect(() => {
    if (From && From.length > 0) {
      if (formattedDate > From) {
        setLow(formattedDate);
      } else setLow(From);
    }
    setHigh(to);
  }, [From, to]);
  useEffect(() => {
    if (date && date.length > 0) {
    const fetchData2 = async () => {
      try {
        const [response] = await Promise.all([
          axios.get('http://127.0.0.1:8000/cinema/checkavailability/'+date+"/"+postId, { headers: { 'Authorization': "Token " + user.token } })])
        setFilteredPosts(response.data);
        setTicketCount(response.data.total)
        setTicketLeft(response.data.tktleft)
        console.log(response.data)
        setWaiting(true);
      }
      catch (error) {
        console.error("Error fetching data:", error);
        setWaiting(true);
        navigate("/");
      }
    };

    fetchData2();}
  }, [date]);


  const handleBooking = (event) => {
    event.preventDefault();
    paymentgateway(filteredPosts);
  };

  return (
    <div>
      {loading ? (
        <div className="center-div" style={{ textAlign: "center" }}>
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
        <div style={{ marginLeft: "10px", marginTop: "10px",textAlign:"center" }}>
          <span>
            {" "}
            {posts.map((postsId) =>
              postsId.id === filteredPosts[0]?.name ? (
                <span className="h1" style={{ textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 2px 0 black"}}>
                  {postsId.name}
                </span>
              ) : null
            )}
            <span className="container" style={{ background: "none" }}>
              {screen.length > 0 &&
                screen.map((screenId) =>
                  screenId.id === filteredPosts[0]?.screen ? (
                    <span className="h6" style={{ textDecoration: "none", textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 1px 0 black"}}>
                      Screen : {screenId.screen}
                    </span>
                  ) : null
                )}
              {slot.length > 0 &&
                slot.map((slotId) =>
                  slotId.id === filteredPosts[0]?.slot ? (
                    <span className="h6" style={{ marginLeft: "20px", textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 1px 0 black"}}>
                      {slotId.time}
                    </span>
                  ) : null
                )}
            </span>
          </span>
        </div>
        <div
          className="container-flex"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <h4 style={{ marginLeft: "20px", textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 1px 0 black"}}>Date & Number of Tickets</h4>
            <input type="date" max={high} min={low} required onChange={(event) => {
              setDate(event.target.value);
            }}></input>
            {waiting ?(<div>
            <h5 style={{ marginLeft: "20px", textAlign:"center", marginTop:"20px", color:"#C44327", textShadow:" -1px 1px 0 black"}}>Available Tickets: {tktlft} </h5>
            <form className="form" onSubmit={handleBooking}>
            <input
              type="number"
              placeholder="Number of seats"
              required
              min={1}
              step={1}
              max={tktlft}
              style={{ marginLeft: "10px" }}
              value={tkt}
              onChange={(event) => {
                setTkt(event.target.value);
              }}
            ></input>
            <span style={{ marginLeft: "10px" }}><b>Amount</b> {tkt * 100}</span>
            <br></br>
            <button
              className="btn btn-danger"
              id="pay-btn"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Proceed to payment
            </button>
          </form></div>):null}
        </div></div>)}
    </div>
  );
}

export default checkAuth(PickDate);
