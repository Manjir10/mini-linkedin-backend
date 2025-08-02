const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

// Auth middleware (same as in posts.js)
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = String(decoded.userId);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET /api/users/:id → public profile + their posts
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("name email bio");
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ author: userId })
      .populate("author", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/:id → edit profile (only self)
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, bio } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { ...(name !== undefined && { name }), ...(bio !== undefined && { bio }) },
      { new: true, select: "name email bio" }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/me — gets the logged-in user's own profile
router.get("/me", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user).select("name email bio");
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ user });
    } catch (err) {
      console.error("❌ /me error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
