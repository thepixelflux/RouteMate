const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ==========================
// REGISTER
// ==========================

const registerUser = async (req, res) => {

    try {

        const {

            fullName,
            email,
            password,
            phone,
            college

        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({

                message: "User already exists"

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            fullName,

            email,

            password: hashedPassword,

            phone,

            college

        });

        res.status(201).json({

            _id: user._id,

            fullName: user.fullName,

            email: user.email,

            token: generateToken(user._id)

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================
// LOGIN
// ==========================

const loginUser = async (req, res) => {

    try {

        const {

            email,
            password

        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({

                message: "Invalid email"

            });

        }

        const isMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid password"

            });

        }

        res.status(200).json({

            _id: user._id,

            fullName: user.fullName,

            email: user.email,

            token: generateToken(user._id)

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    registerUser,

    loginUser

};