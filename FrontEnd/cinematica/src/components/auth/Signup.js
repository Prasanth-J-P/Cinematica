import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import image from "./images/movietktcover.webp";
import checkGuest from "./checkGuest";
function Signup() {
    var [name, setName] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [passwordConf, setPasswordConf] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    var navigate = useNavigate();
    useEffect(() => {
        const passwordInput = document.getElementById('password');
        const togglePasswordButton = document.getElementById('togglePassword');
    
        if (passwordInput && togglePasswordButton) {
          togglePasswordButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
          });
    
          return () => {
            // Cleanup code to remove event listener when component unmounts
            togglePasswordButton.removeEventListener('click', function() {});
          };
        }
      }, [password]); // Empty dependency array ensures the effect runs only once after the component is mounted

    function registerUser(){
        var user = {
            first_name : name,
            email: email,
            password1: password,
            password2: passwordConf
        }
        axios.post('http://127.0.0.1:8000/cinema/signup',user).then(response=>{
            setErrorMessage('');
            alert("Signup Successful");
            navigate('/login');
        }).catch(error=>{
            if( error.response.data.password2 || error.response.data.password1 || error.response.data.email ){
                setErrorMessage(error.response.data.password2 || error.response.data.password1 || error.response.data.email);
            }
            else{
                setErrorMessage('Failed to connect to api');
            }
        })
    }
    return <div>
<Navbar />
        <div className="container" style={{ padding: "0", width: "60%", height: "130%", marginTop: "50px", borderStyle: "solid", borderColor: "black", borderWidth: "1px", borderRadius: "10px", overflow: "hidden", minHeight:"465px" }}>
            <div className="row" style={{ padding: "0" }}>
                <div className="col-md-6 d-none d-md-block" style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPositionX: "center", minHeight:"465px" }}>
                </div>
                <div className="col-12 col-md-6" style={{textAlign:"center", background:"#C44327"}}>
                    <div>
                        <h1 style={{textAlign:"center", marginTop:"10px", color:"white"}}>Welcome!</h1><br/>
                        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> :null}
                        <div style={{textAlign:"center" , lineHeight:"30px"}}>
                        <div className="form-group" >
                            <input type="text" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} value={name} placeholder="Name" onInput={(event) => setName(event.target.value)} />
                        </div>
                        <div className="form-group" >
                            <input type="text" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} value={email} placeholder="Email" onInput={(event) => setEmail(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <input type="password" id="password" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px", position:"relative"}} value={password} placeholder="Password" onInput={(event) => setPassword(event.target.value)} />
                            <button id="togglePassword" style={{position:"absolute", border:"0", padding:"0", marginLeft:"-30px",marginTop:"3px",borderLeft:"solid 1px", background:"none",paddingLeft:"5px"}}><i class="fa fa-eye"></i></button>
                        </div>
                    <div className="form-group">
                        <input type="password" style={{width:"75%", borderRadius:"20px", paddingLeft:"10px", marginBottom:"10px"}} placeholder="Confirm Password" value={passwordConf} onInput={(event)=>setPasswordConf(event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" style={{width:"75%"}} onClick={registerUser}><b>Signup</b></button>
                    </div></div>
                    <div className="col-8 offset-2" style={{marginTop:"30px",color:"white"}}><p>Already have an account? &ensp;<Link to={"/Login"} style={{textDecoration:"None",color:"aqua"}}><b>Login</b></Link></p></div>
    </div>
                </div>
            </div>
        </div>
    </div>
}

export default checkGuest(Signup);