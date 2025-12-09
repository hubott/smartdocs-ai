import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.mjs";
import authRouter from "./routes/auth.mjs";
import protectedRouter from "./routes/protected.mjs";

dotenv.config();

console.log("Starting backend...");

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//Connect DB
await connectDB(process.env.MONGO_URI);

//Define Routes
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);

app.get("/", (req, res) => {
  res.json({ message: "SmartDocs API is running." });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`API running on port ${PORT}`));
