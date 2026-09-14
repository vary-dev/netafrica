const db = require("../config/db");

const getHome = async (req, res) => {
    try {
        const { profileId } = req.params;

        const [profiles] = await db.query(
            `SELECT id, name, avatar
             FROM profiles
             WHERE id = ? AND account_id = ?`,
            [profileId, req.accountId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const profile = profiles[0];

        const [content] = await db.query(
            `SELECT pc.id, pc.type, m.id AS movieId, m.title,
                    m.poster, m.backdrop, m.video_url AS videoUrl,
                    m.duration, m.maturity_rating AS maturityRating
             FROM profile_content pc
             JOIN movies m ON m.id = pc.movie_id
             WHERE pc.profile_id = ?`,
            [profileId]
        );

        const myList = content.filter(item => item.type === "my_list");
        const recentlyWatched = content.filter(item => item.type === "recently_watched");

        res.json({
            success: true,
            data: { profile, myList, recentlyWatched }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getHome
};