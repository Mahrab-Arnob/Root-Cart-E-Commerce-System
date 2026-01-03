import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // ✅ FIX: Do NOT pass { useNewUrlParser: true, useUnifiedTopology: true }
    // Modern Mongoose handles this automatically.
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Throw error so index.js handles it gracefully
    throw error;
  }
};