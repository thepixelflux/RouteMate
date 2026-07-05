const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getRides,
    getRideById,
    createRide,
    updateRide,
    deleteRide,
    searchRides,
    joinRide,
    leaveRide
} = require("../controllers/rideController");


// ==========================
// PUBLIC ROUTES
// ==========================

router.get("/search", searchRides);

router.get("/", getRides);

router.get("/:id", getRideById);


// ==========================
// PROTECTED ROUTES
// ==========================

router.post("/", protect, createRide);

router.put("/:id", protect, updateRide);

router.delete("/:id", protect, deleteRide);

router.post("/:id/join", protect, joinRide);

router.post("/:id/leave", protect, leaveRide);

module.exports = router;