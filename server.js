const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes only once per base path
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes); // ✅ Correct
app.use("/api/users", require("./routes/users"));


const PORT = process.env.PORT || 5050;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));
