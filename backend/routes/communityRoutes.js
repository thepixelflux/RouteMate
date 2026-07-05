const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    getCommunities,

    getCommunityById,

    createCommunity,

    updateCommunity,

    deleteCommunity,

    joinCommunity,

    leaveCommunity

} = require("../controllers/communityController");

// Public
router.get("/", getCommunities);
router.get("/:id", getCommunityById);

// Protected
router.post("/", protect, createCommunity);

router.put("/:id", protect, updateCommunity);

router.delete("/:id", protect, deleteCommunity);

router.post("/:id/join", protect, joinCommunity);

router.post("/:id/leave", protect, leaveCommunity);

module.exports = router;