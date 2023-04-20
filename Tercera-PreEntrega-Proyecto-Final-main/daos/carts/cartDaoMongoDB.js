import mongoose from "mongoose";
import ContainerMongoDB from "../../containers/ContainerMongoDB.js";
import { urlMongoDB } from "../../DB/connection.js"
import { cartSchema, UserSchema } from "../../DB/schemas.js"

mongoose.set("strictQuery", false);

const model_1 = mongoose.model("carts", cartSchema);

const model_2 = mongoose.model("users", UserSchema);

class CartsDaoMongoDB extends ContainerMongoDB {
  constructor() {
    super(model_1, model_2, urlMongoDB)
  }
};

export default CartsDaoMongoDB