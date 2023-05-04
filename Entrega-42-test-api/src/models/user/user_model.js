import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
    address: String,
    age: String,
    phone_number: String,
    image: String,
    cartID: String
  },
  {
    versionKey: false,
  }
);

export const user_Model = mongoose.model("users", UserSchema);
