import jwt from "jsonwebtoken";
import { JWT_secret_key } from "../config/dotenv_config.js";
import { logger } from "../config/winston_config.js"

export function GenerateToken(payload) {
  try {
    const secretKey = JWT_secret_key;
    const token = jwt.sign(payload, secretKey);
    return token;
  } catch (error) {
    logger.error(`Error al generar el token: ${error}`);
    throw error;
  }
}

export function DecodeToken(token) {
  try {
    const decodedToken = jwt.verify(token, JWT_secret_key);
    return decodedToken;
  } catch (error) {
    logger.error(`Error al decodificar el token: ${error}`);
    throw error;
  }
}