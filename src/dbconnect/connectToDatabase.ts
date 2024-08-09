import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (uri) {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB Database");

      const connection = mongoose.connection;
      connection.on("connected", () => {
        console.log("MongoDB Connected");
      });

      connection.on("error", (error) => {
        console.log("MongoDB Connection Error: " + error);
        process.exit(1);
      });

      console.log("MongoDB Database Connected");
    } else {
      throw new Error("MongoDB URI is not set");
    }
  } catch (error) {
    console.log("Error connecting to MongoDB Database: " + error);
    process.exit(1);
  }
};

export default connectToDatabase;
