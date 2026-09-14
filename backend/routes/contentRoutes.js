const express = require("express");
const { getMovies, getMovieBySlug } = require("../controllers/contentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/movies", protect, getMovies);
router.get("/:slug", protect, getMovieBySlug);

module.exports = router;