import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDB connected ... ");
  } catch (error) {
    console.log("error occur during connection into database", error.message);
  }
};

export default connectDB