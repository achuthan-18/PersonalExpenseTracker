import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../components/css/signup.css';
import image from '../../assets/images/registermain.jpg';
import person from '../../assets/images/person.png';
import person2 from '../../assets/images/person2.svg';

const Signup = () => {
    const [name , setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState(null);
    const [showImages, setShowImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate();

    const imageUrls = [
        "https://res.cloudinary.com/dysz2fsik/image/upload/v1745848009/personal%20expense%20Tracker/hnssrzdo5nokf4zvst9h.jpg",
        "https://res.cloudinary.com/dysz2fsik/image/upload/v1745848009/personal%20expense%20Tracker/z12adkhs2lvjwxfpcmlg.jpg",
        "https://res.cloudinary.com/dysz2fsik/image/upload/v1745848008/personal%20expense%20Tracker/jvwfwig5uqucjoumyh6l.jpg",
        "https://res.cloudinary.com/dysz2fsik/image/upload/v1745848008/personal%20expense%20Tracker/n8tpn64gzlk2kbnwqish.jpg",
        "https://res.cloudinary.com/dysz2fsik/image/upload/v1745848008/personal%20expense%20Tracker/l8kabob4ujt3vrzkvrdx.avif",
        "https://res.cloudinary.com/dysz2fsik/image/upload/v1745848008/personal%20expense%20Tracker/yp3kzkpwbpfscuv1kozm.avif"
      ];


    const register = async (name , email , password , selectedImage) => {
        await axios.post('https://personalexpensetracker-ssbg.onrender.com/api/v1/auth/register' ,{name , email , password , selectedImage});
    }
    const handleRegister = async (e) => {
        e.preventDefault();
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

        if (!selectedImage) {
            setError("Please select a profile image.");
            return;
        }

        setError("");

        try {
            await register(name, email, password , selectedImage);
            alert("Registered successfully!");
            navigate("/login");
        } catch(error) {
            alert("Registration failed!");
        }

    };

    const handleImageClick = (url) => {
        setSelectedImage(url);
        setShowImages(false); 
      };

    return (
        <div id="mainregister">
                <form id="registercontainer" onSubmit={handleRegister}>
                    <h1>Register</h1>
                    {showImages && (
                        <div style={{ marginTop: "20px" }} id="showingimage">
                            {imageUrls.map((url, index) => (
                                <img
                                key={index}
                                src={url}
                                alt="Option"
                                style={{ width: "150px", height:"150px" , margin: "10px", cursor: "pointer", border: selectedImage === url ? "3px solid blue" : "2px solid gray" }}
                                onClick={() => handleImageClick(url)}
                                className="images-register"
                                />
                            ))}
                        </div>
                    )}
                    
                    <img
                    src={selectedImage ? selectedImage : person2}
                    alt="Selected or Default"
                    onClick={() => setShowImages(!showImages)}
                    id="register-imageuser"
                    />
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