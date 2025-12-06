import express from "express";
import cors from "cors";
import dotenv from "dotenv";

console.log("Starting backend...");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SmartDocs API is running." });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`API running on port ${PORT}`));
