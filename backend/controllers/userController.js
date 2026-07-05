const User = require("../models/User");

// ======================
// GET ALL USERS
// ======================

const getUsers = async (req,res)=>{

    try{

        const users = await User.find().select("-password");

        res.status(200).json(users);

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

// ======================
// GET PROFILE
// ======================

const getProfile = async(req,res)=>{

    try{

        const user = await User.findById(req.user._id)

        .select("-password");

        res.status(200).json(user);

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

// ======================
// UPDATE PROFILE
// ======================

const updateProfile = async(req,res)=>{

    try{

        const user = await User.findById(req.user._id);

        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }

        user.fullName=req.body.fullName || user.fullName;

        user.phone=req.body.phone || user.phone;

        user.college=req.body.college || user.college;

        user.bio=req.body.bio || user.bio;

        user.profilePic=req.body.profilePic || user.profilePic;

        await user.save();

        res.status(200).json(user);

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

module.exports={

    getUsers,

    getProfile,

    updateProfile

};