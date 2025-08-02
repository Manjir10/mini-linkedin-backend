const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to verify token
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

// Create Post
router.post("/", auth, async (req, res) => {
  try {
    const newPost = new Post({
      text: req.body.text,
      author: req.user,
    });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Like or Unlike Post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const alreadyLiked = post.likes.includes(req.user);

    if (alreadyLiked) {
      post.likes.pull(req.user); // unlike
    } else {
      post.likes.push(req.user); // like
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add Comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user, text });
    await post.save();
    const populatedPost = await post.populate("comments.user", "name");
    res.json(populatedPost.comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Edit a post (only author)
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (String(post.author) !== String(req.user))
      return res.status(403).json({ error: "Forbidden" });

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Post text cannot be empty" });
    }

    post.text = text;
    await post.save();
    const updated = await Post.findById(post._id)
      .populate("author", "name")
      .populate("comments.user", "name");
    res.json(updated);
  } catch (err) {
    console.error("❌ Edit post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a post (only author)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (String(post.author) !== String(req.user))
      return res.status(403).json({ error: "Forbidden" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("❌ Delete post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;