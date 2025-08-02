const express = require("express");
const app = express();

app.use(express.json());

app.post("/test", (req, res) => {
  console.log("🔥 POST /test route hit");
  res.json({ msg: "This is working" });
});

app.get("/test", (req, res) => {
  console.log("✅ GET /test route hit");
  res.send("Test GET working");
});

app.listen(5000, "127.0.0.1", () => {
  console.log("🚀 Server is running on 127.0.0.1:5000");
});
