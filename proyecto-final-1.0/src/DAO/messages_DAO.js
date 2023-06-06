import { msjs_Model } from "../models/messages_model.js";
import { logger } from "../../config/winston_config.js";

class MessagesDaoMongoDB {
  constructor() {
    this.model = msjs_Model;
  }

  async ListMsjs() {
    try {
      const data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(`Error al listar mensajes: ${error}`);
      return { error: "Error al listar mensajes" };
    }
  }

  async ListByEmail(email) {
    try {
      const data = await this.model.find({ 'user.email': email });
      return data;
    } catch (error) {
      logger.error(`Error al lista mensajes por email: ${error}`);
      return { error: `Error al lista mensajes por email: ${error}` };
    }
  }

  async Save(msj) {
    try {
      const newMsj = new this.model(msj);
      await newMsj.save();
      logger.info("Mensaje guardado con exito");
      const msjs = await this.model.find({});
      return msjs
    } catch (error) {
      logger.error(`Error en el guardado del mensaje: ${error}`);
      return { error: `Error en el guardado del mensaje: ${error}` };
    }
  }
}

export default MessagesDaoMongoDB;