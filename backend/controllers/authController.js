const bcrypt = require("bcrypt");
const db = require("../config/db");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [existingAccount] = await db.query(
      "SELECT id FROM accounts WHERE email = ?",
      [email],
    );

    if (existingAccount.length > 0) {
      return res.status(409).json({
        message: "Account already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO accounts (email, password) VALUES (?, ?)",
      [email, hashedPassword],
    );
    const accountId = result.insertId;

    await db.query("INSERT INTO profiles (account_id, name) VALUES (?, ?)", [
      accountId,
      "Main Profile",
    ]);

    res.status(201).json({
    message: "Account created successfully",
    accountId: accountId
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [accounts] = await db.query(
      "SELECT * FROM accounts WHERE email = ?",
      [email],
    );

    if (accounts.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const account = accounts[0];

    const passwordMatch = await bcrypt.compare(password, account.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ accountId: account.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
};
