import { user_Model } from "../models/user/user_model.js";
import {logger}  from "../config/winston_config.js";
import mongoose from "mongoose";

class UserDaoMongoDB {
  constructor() {
    this.model = user_Model;
  }

  async FindUser(query) {
    try {
      let user;
      if (mongoose.Types.ObjectId.isValid(query)) {
        user = await this.model.findOne({ _id: query });
      } else {
        user = await this.model.findOne({ email: query });
      }
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
