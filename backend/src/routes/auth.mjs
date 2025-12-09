import express from "express";
import User from "../models/User.mjs";
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/auth.mjs";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { sub: user._id, username: user.username };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Optionally persist the refresh token in DB for revocation
    user.refreshToken = refreshToken;
    await user.save();

    // Send access token in response body and refresh token as httpOnly cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: "lax",
        path: "/", // available to all routes
        maxAge: 15 * 60 * 1000 // e.g., 15 minutes
});

res.json({ message: "Logged in" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Refresh token endpoint
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Optional: check DB stored refreshToken equals token
    const user = await User.findById(payload.sub);
    if (!user || user.refreshToken !== token) return res.status(401).json({ error: "Invalid refresh token" });

    const newAccessToken = signAccessToken({ sub: user._id, username: user.username });
    const newRefreshToken = signRefreshToken({ sub: user._id, username: user.username });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("jid", newRefreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (token) {
      // If stored in DB, clear it
      try {
        const payload = verifyRefreshToken(token);
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshToken: "" } });
      } catch (e) { /* ignore */ }
    }
    res.clearCookie("jid", { path: "/api/auth/refresh" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
