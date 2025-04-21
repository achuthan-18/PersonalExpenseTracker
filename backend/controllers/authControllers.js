const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = (id) => {return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn: "1h"});}

exports.registerUser = async (req , res) => {
    console.log("Requesting body:", req.body); 
    const {name , email , password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"Please enter all field"});        
    }

    try{
        const existEmail =await User.findOne({email});
        if(existEmail){
            return res.status(400).json({message:"User is already exist"});
        }

        const user = await User.create({
            name , 
            email , 
            password,
        });

        res.status(201).json({
            id : user._id,
            user,
            token : generateToken(user._id)
        });
    }
    catch(err){
        res.status(500).json({message:"Error in registering user" , error : err.message});
    }
};

exports.loginUser=async(req,res)=>{
    const{email,password}=req.body;
    if(!email || !password){
     return res.status(400).json({message:"All fields are reqiured"});
    }
    try{
     const user=await User.findOne({email});
         if(!user||!(await user.comparePassword(password))){
             return res.status(400).json({message:"Invalid credentials"});
         }
         res.status(200).json({
             id:user._id,
             user,
             token:generateToken(user._id),
         });
    }
    catch(err){
       res.status(500).json({message:"Error registering user ",error:err.message})
    }
 }

exports.getUserInfo = async (req , res) => {
    try{
        const user =await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found "});
        }
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({message:"Error registering user ",error:err.message})
    }
};