const db = require("../config/db");

const getProfiles = async (req, res) => {
    try {
        const [profiles] = await db.query(
            "SELECT id, name, avatar, created_at FROM profiles WHERE account_id = ?",
            [req.accountId]
        );

        res.json({
            profiles
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const bcrypt = require("bcrypt");

const createProfile = async (req, res) => {
    try {
        const { name, password, avatar } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                message: "Name and password are required"
            });
        }

        // Get the main account
        const [accounts] = await db.query(
            "SELECT password FROM accounts WHERE id = ?",
            [req.accountId]
        );

        if (accounts.length === 0) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        // Verify the main account password
        const passwordMatch = await bcrypt.compare(
            password,
            accounts[0].password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect account password"
            });
        }

        // Create the profile
        const [result] = await db.query(
            "INSERT INTO profiles (account_id, name, avatar) VALUES (?, ?, ?)",
            [req.accountId, name, avatar || null]
        );

        res.status(201).json({
            message: "Profile created successfully",
            profileId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const [profiles] = await db.query(
            `SELECT id, name, avatar, created_at
             FROM profiles
             WHERE id = ? AND account_id = ?`,
            [id, req.accountId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            profile: profiles[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const selectProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const [profiles] = await db.query(
            `SELECT id, name, avatar
             FROM profiles
             WHERE id = ? AND account_id = ?`,
            [id, req.accountId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            message: "Profile selected successfully",
            profile: profiles[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM profiles
             WHERE id = ? AND account_id = ?`,
            [id, req.accountId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            message: "Profile deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getProfiles,
    createProfile,
    getProfile,
    selectProfile,
    deleteProfile
};