import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/User.js";
import {v2 as cloudinary} from  'cloudinary'

// Register user : /api/user/register
export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return  res.json({success:false, message:"Missing details"})
        }

        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.json({success:false, message:"User already exists"})

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name,email,password:hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly:true ,  //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookie over https
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
            maxAge: 7*24*60*60*1000 //=7 days after cookie will be expired
        })

        return res.json({success:true, user: {email:user.email, name:user.name}})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:   error.message})
    }
}


// Login user : /api/user/login

export const login = async (req, res) => {
try {
        const {email, password} = req.body;
        if(!email || !password)
            return res.json({success:false, message: "missing details"})
        const user = await User.findOne({email})
        if(!user){
            return res.json({success:false, message: "Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success:false, message: "Invalid email or password"})
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly:true ,  //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookie over https
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
            maxAge: 7*24*60*60*1000 //=7 days after cookie will be expired
        })

        return res.json({success:true, user: {email:user.email, name:user.name}})
} catch (error) {
       console.log(error.message)
        res.json({success:false, message:   error.message})
}

}

//check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//logout User : /api/user/logout

export const logout = async (req, res) => {
   try {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.json({success:true, message:"Logged out"})
   } catch (error) {
     console.log(error.message)
        res.json({success:false, message: error.message})
   }
}

// Upload Profile Pic
export const uploadProfilePic = async (req, res) => {
  try {
    const { image } = req.body;
    const userId = req.userId; // 👈 from authUser

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "profile_pics",
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRes.secure_url },
      { new: true }
    );

    res.json({ success: true, profilePic: user.profilePic });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
