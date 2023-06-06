import CartsDaoMongoDB from "../DAO/carts_DAO.js"
import { database_type } from "../../config/dotenv_config.js";

//SINGLETON

let instance = null;

class CartFactory {
  constructor() {
    if (instance) {
      return instance;
    }

    this.cartDAO = null;
    instance = this;
  }
  
  getDAO() {
    if (!this.cartDAO) {
      switch(database_type) {
        case "MONGO":
          this.cartDAO = new CartsDaoMongoDB();
          break;
        default:
          throw new Error("No se ha definido un tipo de base de datos");
          break;
      }
    }
    return this.cartDAO;
  }
}

export default new CartFactory();