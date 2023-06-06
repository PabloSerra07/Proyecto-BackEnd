import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const cartSchema = new mongoose.Schema(
  {
    timestamp: String,
    products: Array,
  },
  {
    versionKey: false,
  }
);

export const cart_Model = mongoose.model("carts", cartSchema);
