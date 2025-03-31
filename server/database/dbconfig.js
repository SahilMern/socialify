import mongoose from "mongoose";
const databaseUrl = process.env.DATABASE_URL;

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/instagram",
      {}
    );
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

export default connectDb;
