import { Msj_Model } from "../models/mensaje/mensaje_model.js";
import { logger } from "../config/winston_config.js";

class MsjDaoMongoDB {
  constructor() {
    this.model = Msj_Model;
  }

  async ListarMsjs() {
    try {
      let msjs = await this.model.find({});
      return msjs;
    } catch (error) {
      logger.error(`Error en la API de mensajes: ${error}`);
    }
  }

  async guardarMsj(data) {
    console.log(
      `guardarMsj se ejecuta y va a guardar la siguiente data: ${data}`
    ); //TESTEO
    // try {
    //   const newMsj = new this.model(data);
    //   await newMsj.save();
    //   console.log("Mensaje guardado con exito");
    // } catch (error) {
    //   logger.error(`Error en la API de mensajes: ${error}`);
    // }
  }
}
export default MsjDaoMongoDB;