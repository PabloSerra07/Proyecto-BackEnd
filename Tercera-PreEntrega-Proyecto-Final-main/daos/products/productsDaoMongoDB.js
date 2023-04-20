import ContainerMongoDB from "../../containers/ContainerMongoDB.js";
import { urlMongoDB } from "../../DB/connection.js";
import { ProdsSchema, UserSchema } from "../../DB/schemas.js"
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const model_1 = mongoose.model("products", ProdsSchema);

const model_2 = mongoose.model("users", UserSchema);

class ProductsDaoMongoDB extends ContainerMongoDB {
  constructor() {
    super(model_1, model_2, urlMongoDB);
  }
}

export default ProductsDaoMongoDB