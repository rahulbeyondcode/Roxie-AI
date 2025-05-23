import { QdrantClient } from "@qdrant/js-client-rest";
import mongoose from "mongoose";

export const QdrantDB = new QdrantClient({ host: "localhost", port: 6333 });

try {
  await mongoose.connect("mongodb://localhost:27017/roxie");
  console.log("MongoDB connected ✅");
} catch (error) {
  console.error("MongoDB connection error:", error);
}
