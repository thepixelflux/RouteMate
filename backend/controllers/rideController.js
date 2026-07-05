const Ride = require("../models/Ride");

// ================================
// GET ALL RIDES
// ================================

const getRides = async (req, res) => {

    try {

        const rides = await Ride.find()
            .populate("driver", "fullName email profilePic rating")
            .populate("passengers", "fullName email profilePic");

        res.status(200).json(rides);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ================================
// GET SINGLE RIDE
// ================================

const getRideById = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.id)
            .populate("driver", "fullName email profilePic rating")
            .populate("passengers", "fullName email profilePic");

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        res.status(200).json(ride);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ================================
// CREATE RIDE
// ================================

const createRide = async (req, res) => {

    try {

        const ride = await Ride.create({

            driver: req.user._id,

            source: req.body.source,

            destination: req.body.destination,

            date: req.body.date,

            departureTime: req.body.departureTime,

            availableSeats: req.body.availableSeats,

            price: req.body.price,

            vehicleType: req.body.vehicleType,

            passengers: [],

            status: "Available"

        });

        const createdRide = await Ride.findById(ride._id)
            .populate("driver", "fullName email profilePic rating");

        res.status(201).json(createdRide);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};

// ================================
// UPDATE RIDE
// ================================

const updateRide = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.id);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        if (ride.driver.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "You can only update your own ride."
            });

        }

        // Prevent protected fields from being modified
        delete req.body.driver;
        delete req.body.passengers;
        delete req.body.status;

        ride.source = req.body.source || ride.source;

        ride.destination = req.body.destination || ride.destination;

        ride.date = req.body.date || ride.date;

        ride.departureTime =
            req.body.departureTime || ride.departureTime;

        ride.availableSeats =
            req.body.availableSeats ?? ride.availableSeats;

        ride.price =
            req.body.price ?? ride.price;

        ride.vehicleType =
            req.body.vehicleType || ride.vehicleType;

        await ride.save();

        const updatedRide = await Ride.findById(ride._id)
            .populate("driver", "fullName email profilePic rating")
            .populate("passengers", "fullName email profilePic");

        res.status(200).json(updatedRide);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ================================
// DELETE RIDE
// ================================

const deleteRide = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.id);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        if (ride.driver.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "You can only delete your own ride."
            });

        }

        await ride.deleteOne();

        res.status(200).json({
            message: "Ride deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ================================
// SEARCH RIDES
// ================================

const searchRides = async (req, res) => {

    try {

        const { source, destination, date } = req.query;

        const query = {};

        if (source) {

            query.source = {
                $regex: source,
                $options: "i"
            };

        }

        if (destination) {

            query.destination = {
                $regex: destination,
                $options: "i"
            };

        }

        if (date) {

            const selectedDate = new Date(date);

            const nextDate = new Date(selectedDate);

            nextDate.setDate(nextDate.getDate() + 1);

            query.date = {

                $gte: selectedDate,

                $lt: nextDate

            };

        }

        const rides = await Ride.find(query)
            .populate("driver", "fullName email profilePic rating")
            .populate("passengers", "fullName email profilePic");

        res.status(200).json(rides);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ================================
// JOIN RIDE
// ================================

const joinRide = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.id);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        if (ride.driver.toString() === req.user._id.toString()) {

            return res.status(400).json({
                message: "Driver cannot join their own ride."
            });

        }

        const alreadyJoined = ride.passengers.some(

            passenger => passenger.toString() === req.user._id.toString()

        );

        if (alreadyJoined) {

            return res.status(400).json({
                message: "You have already joined this ride."
            });

        }

        if (ride.availableSeats <= 0) {

            return res.status(400).json({
                message: "No seats available."
            });

        }

        ride.passengers.push(req.user._id);

        ride.availableSeats--;

        if (ride.availableSeats === 0) {

            ride.status = "Full";

        }

        await ride.save();

        const updatedRide = await Ride.findById(ride._id)
            .populate("driver", "fullName email profilePic rating")
            .populate("passengers", "fullName email profilePic");

        res.status(200).json({

            message: "Ride joined successfully.",

            ride: updatedRide

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ================================
// LEAVE RIDE
// ================================

const leaveRide = async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.id);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        const passengerExists = ride.passengers.some(

            passenger => passenger.toString() === req.user._id.toString()

        );

        if (!passengerExists) {

            return res.status(400).json({
                message: "You are not part of this ride."
            });

        }

        ride.passengers = ride.passengers.filter(

            passenger => passenger.toString() !== req.user._id.toString()

        );

        ride.availableSeats++;

        if (ride.status === "Full") {

            ride.status = "Available";

        }

        await ride.save();

        const updatedRide = await Ride.findById(ride._id)
            .populate("driver", "fullName email profilePic rating")
            .populate("passengers", "fullName email profilePic");

        res.status(200).json({

            message: "You left the ride successfully.",

            ride: updatedRide

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ================================
// EXPORTS
// ================================

module.exports = {

    getRides,

    getRideById,

    createRide,

    updateRide,

    deleteRide,

    searchRides,

    joinRide,

    leaveRide

};




