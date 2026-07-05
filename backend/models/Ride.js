const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
{
    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    source:{
        type:String,
        required:true,
        trim:true
    },

    destination:{
        type:String,
        required:true,
        trim:true
    },

    date:{
        type:Date,
        required:true
    },

    departureTime:{
        type:String,
        required:true
    },

    availableSeats:{
        type:Number,
        required:true,
        min:1
    },

    price:{
        type:Number,
        required:true,
        min:0
    },

    vehicleType:{
        type:String,
        enum:["Car","Bike","Auto","Cab"],
        default:"Car"
    },

    status:{
        type:String,
        enum:["Available","Full","Completed","Cancelled"],
        default:"Available"
    },

    passengers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},
{
    timestamps:true
});

module.exports = mongoose.model("Ride",rideSchema);