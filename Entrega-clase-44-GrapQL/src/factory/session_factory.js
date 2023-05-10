import UserDaoMongoDB from "../DAO/session_DAO.js";
import  {database_type}  from "../config/dotenv_config.js";

//SINGLETON

let instance = null;

class SessionFactory {
  constructor() {
    if (instance) {
      return instance;
    }

    this.sessionDAO = null;
    instance = this;
  }
  
  getDAO() {
    if (!this.sessionDAO) {
      switch(database_type) {
        case "MONGO":
          this.sessionDAO = new UserDaoMongoDB();
          break;
        default:
          throw new Error("No se ha definido un tipo de base de datos");
          break;
      }
    }
    return this.sessionDAO;
  }
}

export default new SessionFactory();
