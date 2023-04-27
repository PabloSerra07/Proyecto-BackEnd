import { user_Model } from "../models/user/user_model.js";
import { logger } from "../config/winston_config.js";

class UserDaoMongoDB {
  constructor() {
    this.model = user_Model;
  }

  async FindUser(email) {
    try {
      const user = await this.model.findOne({ email: email });
      logger.info(`Usuario encontrado`);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async SaveUser(newUser) {
    try {
      const userToSave = new this.model(newUser);
      userToSave.save();
      logger.info(`Usuario: ${newUser.username} registrado con exito!`);
    } catch (error) {
      logger.error(error);
    }
  }
}
export default UserDaoMongoDB;
