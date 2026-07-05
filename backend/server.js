const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ===============================
// DB CONNECTION
// ===============================
const connectDB = require("./config/db");

// ===============================
// ROUTES
// ===============================
const userRoutes = require("./routes/userRoutes");
const rideRoutes = require("./routes/rideRoutes");
const communityRoutes = require("./routes/communityRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

// ===============================
// APP
// ===============================
const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// CONNECT DB
// ===============================
connectDB();

// ===============================
// ROUTES
// ===============================
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/rides", rideRoutes);
app.use("/communities", communityRoutes);
app.use("/messages", messageRoutes);

// ===============================
// HOME
// ===============================
app.get("/", (req, res) => {
    res.send(" RouteMate API is running...");
});

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});