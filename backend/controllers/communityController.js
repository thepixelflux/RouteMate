const Community = require("../models/Community");

// ======================
// GET ALL COMMUNITIES
// ======================

const getCommunities = async (req, res) => {

    try {

        const communities = await Community.find()
            .populate("createdBy", "fullName email")
            .populate("members", "fullName email");

        res.status(200).json(communities);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// GET COMMUNITY BY ID
// ======================

const getCommunityById = async (req, res) => {

    try {

        const community = await Community.findById(req.params.id)
            .populate("createdBy", "fullName email")
            .populate("members", "fullName email");

        if (!community) {

            return res.status(404).json({
                message: "Community not found"
            });

        }

        res.status(200).json(community);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// CREATE COMMUNITY
// ======================

const createCommunity = async (req, res) => {

    try {

        const community = await Community.create({

            ...req.body,

            createdBy: req.user._id,

            members: [req.user._id]

        });

        res.status(201).json(community);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};

// ======================
// UPDATE COMMUNITY
// ======================

const updateCommunity = async (req, res) => {

    try {

        const community = await Community.findById(req.params.id);

        if (!community) {

            return res.status(404).json({
                message: "Community not found"
            });

        }

        if (community.createdBy.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "Only the creator can update this community."
            });

        }

        Object.assign(community, req.body);

        await community.save();

        res.status(200).json(community);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// DELETE COMMUNITY
// ======================

const deleteCommunity = async (req, res) => {

    try {

        const community = await Community.findById(req.params.id);

        if (!community) {

            return res.status(404).json({
                message: "Community not found"
            });

        }

        if (community.createdBy.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "Only the creator can delete this community."
            });

        }

        await community.deleteOne();

        res.status(200).json({
            message: "Community deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// JOIN COMMUNITY
// ======================

const joinCommunity = async (req, res) => {

    try {

        const community = await Community.findById(req.params.id);

        if (!community) {

            return res.status(404).json({
                message: "Community not found"
            });

        }

        if (community.members.includes(req.user._id)) {

            return res.status(400).json({
                message: "Already a member."
            });

        }

        community.members.push(req.user._id);

        await community.save();

        res.status(200).json({
            message: "Joined community successfully.",
            community
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// LEAVE COMMUNITY
// ======================

const leaveCommunity = async (req, res) => {

    try {

        const community = await Community.findById(req.params.id);

        if (!community) {

            return res.status(404).json({
                message: "Community not found"
            });

        }

        community.members = community.members.filter(

            member => member.toString() !== req.user._id.toString()

        );

        await community.save();

        res.status(200).json({

            message: "Left community successfully.",

            community

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    getCommunities,

    getCommunityById,

    createCommunity,

    updateCommunity,

    deleteCommunity,

    joinCommunity,

    leaveCommunity

};