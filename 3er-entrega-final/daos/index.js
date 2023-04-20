import CartDaoMongoDB from "./carts/cartDaoMongoDB.js";
import ProductsDaoMongoDB from "./products/productsDaoMongoDB.js";

export const cartDaoMongoDB = new CartDaoMongoDB();
export const productsDaoMongoDB = new ProductsDaoMongoDB();