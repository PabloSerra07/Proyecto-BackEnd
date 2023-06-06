import ProductsDaoMongoDB from "../DAO/products_DAO.js";
import { database_type } from "../../config/dotenv_config.js";

//SINGLETON

let instance = null;

class ProductsFactory {
  constructor() {
    if (instance) {
      return instance;
    }

    this.productsDAO = null;
    instance = this;
  }
  
  getDAO() {
    if (!this.productsDAO) {
      switch(database_type) {
        case "MONGO":
          this.productsDAO = new ProductsDaoMongoDB();
          break;
        default:
          throw new Error("No se ha definido un tipo de base de datos");
          break;
      }
    }
    return this.productsDAO;
  }
}

export default new ProductsFactory();
