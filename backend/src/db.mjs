import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI not provided");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("MongoDB connected");
}
