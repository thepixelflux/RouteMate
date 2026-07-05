const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullName:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        trim:true,
        default:""
    },

    college:{
        type:String,
        required:true,
        trim:true
    },

    profilePic:{
        type:String,
        default:""
    },

    bio:{
        type:String,
        default:""
    },

    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    },

    totalRatings:{
        type:Number,
        default:0,
        min:0
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);