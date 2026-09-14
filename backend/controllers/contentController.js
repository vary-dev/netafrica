const db = require("../config/db");

function parseGenres(raw) {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // not JSON, fall through to comma-split
    }
    return raw.split(",").map((g) => g.trim()).filter(Boolean);
}

const mapMovie = (row) => ({
    id: row.id,
    slug: row.id,
    type: "MOVIE",
    title: row.title,
    eyebrow: row.eyebrow,
    description: row.description,
    year: row.year,
    maturityRating: row.maturity_rating,
    runtimeLabel: row.duration,
    genres: parseGenres(row.genres),
    posterUrl: row.poster,
    backdropUrl: row.backdrop,
    videoUrl: row.video_url
});

const getMovies = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM movies ORDER BY title ASC"); 
        res.json({ success: true, data: rows.map(mapMovie) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getMovieBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [rows] = await db.query("SELECT * FROM movies WHERE id = ?", [slug]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Title not found" });
        }

        res.json({ success: true, data: mapMovie(rows[0]) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getMovies, getMovieBySlug };