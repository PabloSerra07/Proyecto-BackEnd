import mongoose from "mongoose";
  
mongoose.set("strictQuery", false);

const MsjSchema = new mongoose.Schema(
    {
      author: Object,
      fyh: String,
      text: String,
    },
    {
      versionKey: false,
    }
);

export const Msj_Model = mongoose.model("messages", MsjSchema);