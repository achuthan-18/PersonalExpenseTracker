import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../components/css/login.css';
import image from '../../assets/images/login2.png';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState(null);

    const navigate = useNavigate();

//     const API_URL = "http://localhost:5000/api/auth/";

//     const login = async (username, password) => {
//     const response = await axios.post(`${API_URL}login`, { username, password });
//     if (!response.data.token) {
//         throw new Error("Invalid credentials");
//     }
//     localStorage.setItem("token", response.data.token);
//     return response.data;
// };

    const handleLogin = async (e) => {
      e.preventDefault();
        // try {
        //     const data = await login(username, password);
        //     console.log("Login successful, data received:", data); 
        //     if (data.token) {
        //         alert(`Welcome ${data.username}`);
        //         navigate("/profile");
        //     }
        // } catch (error) {
        //     console.error("Login failed:", error);
        //     alert("Login failed. Please check your credentials.");
        // }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        <div id="mainlogin">
              <img src={image} alt="login"/>
              <form id="logincontainer" onSubmit={handleLogin}>
                  <h1>Login</h1>
                  <input 
                      placeholder="Username" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      id="name"
                  />
                  <input 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      id="password"
                  />
                  {error && 
                      <div className="errormessage">
                          <span className="material-icons" style={{ color: 'red', verticalAlign: 'middle', marginRight: '5px' }}>
                          error
                          </span>
                          <span>{error}</span>
                      </div>}
                      <button 
                      type="submit"
                      >Login</button>
                  <p onClick={() => {
                      navigate('/signup')
                  }} id="askacnt">Don't have an account</p>
              </form>
        </div>
    );
};

export default Login;
