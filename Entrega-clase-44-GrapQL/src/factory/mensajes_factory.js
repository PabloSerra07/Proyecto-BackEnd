import MsjDaoMongoDB from "../DAO/mensajes_DAO.js";
import  {database_type}  from "../config/dotenv_config.js"

//SINGLETON

let instance = null;

class MensajesFactory {
  constructor() {
    if (instance) {
      return instance;
    }

    this.mensajesDAO = null;
    instance = this;
  }

  getDAO() {
    if (!this.mensajesDAO) {
      switch(database_type) {
        case "MONGO":
          this.mensajesDAO = new MsjDaoMongoDB();
          break;
        default:
          throw new Error("No se ha definido un tipo de base de datos");
          break;
      }
    }

    return this.mensajesDAO;
  }
}

export default new MensajesFactory();
