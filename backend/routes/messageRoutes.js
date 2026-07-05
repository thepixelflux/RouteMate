const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getRideMessages,
    sendMessage,
    deleteMessage
} = require("../controllers/messageController");


// ==========================
// CHAT ROUTES (RIDE BASED)
// ==========================

router.get("/:rideId", protect, getRideMessages);

router.post("/:rideId", protect, sendMessage);


// ==========================
// DELETE MESSAGE
// ==========================

router.delete("/message/:id", protect, deleteMessage);

module.exports = router;