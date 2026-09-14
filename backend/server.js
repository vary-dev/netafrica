const express = require("express");
const cors = require("cors");
const db = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const profileRoutes = require("./routes/profileRoutes");
const homeRoutes = require("./routes/homeRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/profiles", homeRoutes);   // was "/api/home" — wrong prefix
app.use("/api/content", contentRoutes); // new

app.get("/", (req, res) => res.send("Netflix Backend API is running!"));

app.listen(PORT, async () => {
    try {
        await db.query("SELECT 1");
        console.log("MySQL connected successfully!");
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
});