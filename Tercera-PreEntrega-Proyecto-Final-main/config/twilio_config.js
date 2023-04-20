import dotenv from "dotenv";
import twilio from "twilio";
import { logger } from "./winston_config.js";
dotenv.config();

export async function MsjToUser_Twilio (user, orderID) {

    const accountSID = process.env.ACCOUNTSID;
    const authToken = process.env.AUTHTOKEN

    const client = twilio(accountSID, authToken);

    try{
        const message = await client.messages.create({
            body: `Su pedido ha sido recibido y se encuentra en proceso! N° de orden: ${orderID}`,
            from: process.env.TWILIO_PHONE,
            to: user.phone_number
        })
        logger.info(message)
    }catch(error){
        logger.error(`Error al enviarle MSJ de texto a usuario notificando nueva orden: ${error}`)
    } 
}