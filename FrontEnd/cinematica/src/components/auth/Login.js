import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import checkGuest from "./checkGuest";
import image from "./images/movietktcover.webp";
import Navbar from "../Navbar";
import image1 from "./images/background.jpg"
function Login() {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    let navigate = useNavigate();
    useEffect(() => {
        const passwordInput = document.getElementById('password');
        const togglePasswordButton = document.getElementById('togglePassword');

        if (passwordInput && togglePasswordButton) {
            togglePasswordButton.addEventListener('click', function () {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
            });

            return () => {
                togglePasswordButton.removeEventListener('click', function () { });
            };
        }
    }, [password]);
    function attemptLogin() {
        axios.post('http://127.0.0.1:8000/cinema/login', {
            email: email,
            password: password
        }).then(response => {
            setErrorMessage('')
            var user = {
                email: email,
                token: response.data.token
            }
            dispatch(setUser(user));
            navigate('/')
            setTimeout(() => {
                alert("Logged in Successfully");
            }, 500);
        }).catch(error => {
            if (error.response.data.errors) {
                setErrorMessage(Object.values(error.response.data.errors).join(' '))
            } else if (error.response.data.message) {
                setErrorMessage(error.response.data.message)
            } else {
                setErrorMessage('Failed to login user. Please contact admin')
            }
        })
    }
    return (<div>
        <Navbar />
        <div className="container" style={{ padding: "0", width: "60%", height: "130%", marginTop: "50px", borderStyle: "solid", borderColor: "black", borderWidth: "1px", borderRadius: "10px", overflow: "hidden", minHeight: "465px", backgroundImage: `url(${image1})`, backgroundSize: "cover" }}>
            <div className="row" style={{ padding: "0", height: "100%" }}>
                <div className="col-md-6 d-none d-md-block" style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPositionX: "center", height: "130%", minHeight: "465px" }}>
                </div>
                <div className="col-12 col-md-6" style={{ textAlign: "center", background: "#C44327" }}>
                    <div style={{ marginTop: "70px" }}>
                        <h1 style={{ textAlign: "center", marginTop: "10px", color: "white" }}>Hey!</h1><br />
                        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
                        <div style={{ textAlign: "center", lineHeight: "30px" }}>
                            <div className="form-group" >
                                <input type="text" style={{ width: "75%", borderRadius: "20px", paddingLeft: "10px", marginBottom: "10px" }} value={email} placeholder="Email" onInput={(event) => setEmail(event.target.value)} />
                            </div>
                            <div className="form-group">
                                <input type="password" id="password" style={{ width: "75%", borderRadius: "20px", paddingLeft: "10px", marginBottom: "10px" }} value={password} placeholder="Password" onInput={(event) => setPassword(event.target.value)} />
                                <button id="togglePassword" style={{ position: "absolute", border: "0", padding: "0", marginLeft: "-30px", marginTop: "3px", borderLeft: "solid 1px", background: "none", paddingLeft: "5px" }}><i class="fa fa-eye"></i></button>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary" style={{ width: "75%" }} onClick={attemptLogin}><b>Login</b></button>
                            </div>
                        </div></div>
                    <div className="col-8 offset-2" style={{ marginTop: "30px", textAlign: "center", color: "white" }}><p>New here? &ensp;<Link to={"/signup"} style={{ textDecoration: "None", color: "aqua" }}><b>Signup</b></Link></p></div>

                </div>

            </div>
        </div>

    </div>)
}

export default checkGuest(Login);