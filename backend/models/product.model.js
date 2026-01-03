import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    offerPrice: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // ✅ FIX: Changed to Array to support multiple images
    images: {
      type: [String],
      required: true,
      default: []
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    weight: String, // Added weight as it was used in frontend
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;