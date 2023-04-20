import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../config/winston_config.js";
dotenv.config();

export const urlMongoDB = process.env.URLMONGODB;

export const sessionKey = process.env.SESSIONKEY;

export async function MongoDB_Connect (){
  try {
    await mongoose.connect(urlMongoDB, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(
      'Base de datos MongoDB conectada con exito'
    );
  } catch (err) {
    logger.error(
      `error al conectar la base de datos: ${err}`
    );
  }
};

export async function MongoDB_Disconnect (){
  try{
    await mongoose.disconnect();
    logger.info(
      'Base de datos MongoDB desconectada con exito'
    );
  } catch(err) {
    logger.error(
      `error al desconectar la base de datos: ${err}`
    );
  }
};