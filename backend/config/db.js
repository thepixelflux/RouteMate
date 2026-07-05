const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MongoDB Connection Failed: MONGO_URI is not set in .env");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB Atlas...");

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`MongoDB connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:");
        console.error(error.message);

        if (error.message.includes("bad auth")) {
            console.error("Check your Atlas username/password in MONGO_URI. URL-encode special characters in the password.");
        }

        process.exit(1);
    }
};

module.exports = connectDB;
