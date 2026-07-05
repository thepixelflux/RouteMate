const Message = require("../models/Message");
const Ride = require("../models/Ride");

// ====================================
// GET ALL MESSAGES OF A RIDE
// ====================================

const getRideMessages = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.rideId);

        if (!ride) {

            return res.status(404).json({

                message: "Ride not found"

            });

        }

        const isDriver = ride.driver.toString() === req.user._id.toString();

        const isPassenger = ride.passengers.some(

            passenger => passenger.toString() === req.user._id.toString()

        );

        if (!isDriver && !isPassenger) {

            return res.status(403).json({

                message: "You are not a member of this ride."

            });

        }

        const messages = await Message.find({

            ride: req.params.rideId

        })

        .populate("sender", "fullName profilePic")

        .sort({

            createdAt: 1

        });

        res.status(200).json(messages);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ====================================
// SEND MESSAGE
// ====================================

const sendMessage = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.rideId);

        if (!ride) {

            return res.status(404).json({

                message: "Ride not found"

            });

        }

        const isDriver = ride.driver.toString() === req.user._id.toString();

        const isPassenger = ride.passengers.some(

            passenger => passenger.toString() === req.user._id.toString()

        );

        if (!isDriver && !isPassenger) {

            return res.status(403).json({

                message: "Only ride members can send messages."

            });

        }

        const message = await Message.create({

            ride: req.params.rideId,

            sender: req.user._id,

            message: req.body.message

        });

        const populatedMessage = await Message.findById(message._id)

        .populate("sender", "fullName profilePic");

        res.status(201).json(populatedMessage);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ====================================
// DELETE MESSAGE
// ====================================

const deleteMessage = async (req, res) => {

    try {

        const message = await Message.findById(req.params.id);

        if (!message) {

            return res.status(404).json({

                message: "Message not found"

            });

        }

        if (message.sender.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                message: "You can only delete your own message."

            });

        }

        await message.deleteOne();

        res.status(200).json({

            message: "Message deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getRideMessages,

    sendMessage,

    deleteMessage

};