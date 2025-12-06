import express from "express";

console.log("Starting test server...");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Keep alive explicitly
app.listen(8080, '0.0.0.0', () => {
  console.log("Server running on port 5000 — should stay alive now");
});

// Prevent Node from exiting immediately
process.stdin.resume();
