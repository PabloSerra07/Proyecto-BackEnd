import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
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
  
export const ProdsSchema = new mongoose.Schema(
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

export const cartSchema = new mongoose.Schema({
    timestamp: String,
    products: Array
  }, {
    versionKey: false
});

export const orderSchema = new mongoose.Schema({
  timestamp: String,
  user: Object,
  products: Array
}, {
  versionKey: false
})