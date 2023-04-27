import { urlMongoDB } from "../../config/dotenv_config.js";
import { logger } from "../../config/winston_config.js";
import mongoose from "mongoose";

class ConnectionDaoMongoDB {
  constructor() {
    this.url = urlMongoDB;
  }

  async MongoDB_Connect() {
    try {
      await mongoose.connect(urlMongoDB, {
        serverSelectionTimeoutMS: 10000,
      });
      logger.info("Base de datos MongoDB conectada con exito");
    } catch (err) {
      logger.error(`Error al conectar la base de datos: ${err}`);
    }
  }

  async MongoDB_Disconnect() {
    try {
      await mongoose.disconnect();
      logger.info("Base de datos MongoDB desconectada con exito");
    } catch (err) {
      logger.error(`error al desconectar la base de datos: ${err}`);
    }
  }
}
export default ConnectionDaoMongoDB;
