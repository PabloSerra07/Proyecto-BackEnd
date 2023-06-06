import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const msjsSchema = new mongoose.Schema(
  {
    user: Object,
    timestamp: String,
    text: String,
  },
  {
    versionKey: false,
  }
);

export const msjs_Model = mongoose.model("messages", msjsSchema);
