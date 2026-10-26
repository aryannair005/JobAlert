import mongoose from "mongoose";
export async function connectMongo(service) {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("[" + service + "] MongoDB connected");
}
