import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}


let isConnected = false;
export async function connectToDatabase() {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DB connected already");
    return;
  }
  try {
    await mongoose.connect(uri, {
      dbName: "imaniescrow",
    });
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
}
