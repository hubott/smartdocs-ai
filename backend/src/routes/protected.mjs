import express from "express";
import User from "../models/User.mjs";
import requireAuth from "../middleware/auth.mjs";

const router = express.Router();

// GET /protected/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    // req.user.sub comes from JWT payload
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Send only the fields frontend needs
    res.json({
      id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
