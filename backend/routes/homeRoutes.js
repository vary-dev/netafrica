const express = require("express");

const { getHome } = require("../controllers/homeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:profileId", protect, getHome);

module.exports = router;