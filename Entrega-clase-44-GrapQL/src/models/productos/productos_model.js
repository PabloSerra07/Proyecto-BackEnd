import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const ProdsSchema = new mongoose.Schema(
  {
      title: {
      type: String,
      unique: true,
      },
      price: String,
      thumbnail: String,
      timestamp: String,
      code: {
      type: String,
      unique: true,
      },
      stock: String,
      brand: String
  },
  {
      versionKey: false,
  }
);

export const prods_Model = mongoose.model("products", ProdsSchema);