import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../components/css/signup.css';
import image from '../../assets/images/registermain.jpg';

const Signup = () => {
    const [name , setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        // try {
        //     await register(username, password);
        //     alert("Registered successfully!");
        //     navigate("/login");
        // } catch (error) {
        //     alert("Registration failed!");
        // }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!name){
            setError("Please enter the Name");
            return;
        }

        if(!email){
            setError("Please enter the email");
            return;
        }

        if(!regex.test(email)){
            setError("Please Enter a valid email");
            return;
        }

        if(!password){
            setError("Please enter the password");
            return;
        }
        setError("");
        alert("success");
    };

    return (
        <div id="mainregister">
                <form id="registercontainer" onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    
                    {error && 
                    <div className="errormessage">
                        <span className="material-icons" style={{ color: 'red', verticalAlign: 'middle', marginRight: '5px' }}>
                        error
                        </span>
                        <span>{error}</span>
                    </div>}
                    <button 
                    type="submit"
                    >Register</button>
                    <p 
                    onClick={() => {navigate('/login')}}
                    id="askacnt"
                    >Already Have an account</p>
                </form>
                <img src={image} alt="register"/>
        </div>
    );
};

export default Signup;