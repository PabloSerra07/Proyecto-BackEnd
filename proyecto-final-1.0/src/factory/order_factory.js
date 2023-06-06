import OrdersDaoMongoDB from "../DAO/orders_DAO.js"
import { database_type } from "../../config/dotenv_config.js";

//SINGLETON

let instance = null;

class OrderFactory {
  constructor() {
    if (instance) {
      return instance;
    }

    this.orderDAO = null;
    instance = this;
  }
  
  getDAO() {
    if (!this.orderDAO) {
      switch(database_type) {
        case "MONGO":
          this.orderDAO = new OrdersDaoMongoDB();
          break;
        default:
          throw new Error("No se ha definido un tipo de base de datos");
          break;
      }
    }
    return this.orderDAO;
  }
}

export default new OrderFactory();