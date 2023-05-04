import  {urlMongoDB}  from "../config/dotenv_config.js";
import  {logger}  from "../config/winston_config.js";
import mongoose from "mongoose";

//SINGLETON

class ConnectionMongoDB {
  constructor() {
    this.url = urlMongoDB;
    this.isConnected = false;
  }

  async MongoDB_Connect() {
    try {
      await mongoose.connect(urlMongoDB, {
        serverSelectionTimeoutMS: 10000,
      });
      logger.info("Base de datos MongoDB conectada con exito");
      this.isConnected = true;
    } catch (err) {
      logger.error(`Error al conectar la base de datos: ${err}`);
    }
  }
}

let connectionMongoDB = null;

export default function getConnectionMongoDB() {
  if (!connectionMongoDB) {
    connectionMongoDB = new ConnectionMongoDB();
  }
  return connectionMongoDB;
}
