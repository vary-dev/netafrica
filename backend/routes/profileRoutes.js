const express = require("express");

const {
    getProfiles,
    createProfile,
    getProfile,
    deleteProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getProfiles);

router.post("/", protect, createProfile);

router.get("/:id", protect, getProfile);

router.delete("/:id", protect, deleteProfile);

module.exports = router;