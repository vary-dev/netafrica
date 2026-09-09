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
                message: "Profile not found"
            });
        }

        const profile = profiles[0];

        const [content] = await db.query(
            `SELECT id, title, type
             FROM profile_content
             WHERE profile_id = ?`,
            [profileId]
        );

        const myList = content.filter(
            item => item.type === "my_list"
        );

        const recentlyWatched = content.filter(
            item => item.type === "recently_watched"
        );

        res.json({
            profile,
            myList,
            recentlyWatched
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getHome
};
