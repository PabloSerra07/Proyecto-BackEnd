import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { logger } from "../config/winston_config.js"
dotenv.config();

export function MsjToAdmin_Telegram (user, orderID) {

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling:true})

    try{
        bot.on('message', (msg) => {
            const chatID = msg.chat.id
            const message = `Nueva orden de ${user.username} <${user.email}> | ${user.phone_number} | N° orden: ${orderID}`
            bot.sendMessage(chatID, message)
        })
        logger.info('Mensaje de Telegram enviado con exito al admin!')
    }catch(error){
        logger.error(`Error al enviarle MSJ de Telegram a Admin notificando nueva orden: ${error}`)
    }
}