import { cart_Model } from "../models/cart_model.js";
import { user_Model } from "../models/user_model.js";
import { order_Model } from "../models/order_model.js";
import { logger } from "../../config/winston_config.js";
import { orderDTO } from "../DTO/order_DTO.js";
import { Email_NewOrder } from "../../config/nodemailer_config.js";
import mongoose from "mongoose";

class OrdersDaoMongoDB {
  constructor() {
    this.model_cart = cart_Model;
    this.model_user = user_Model;
    this.model_order = order_Model;
  }

  async CreateOrder(idUser, idCart) {
    try {
      const cart = await this.model_cart.findById(idCart);
      const user = await this.model_user.findById(idUser);

      const orderToAdd = orderDTO(user, cart.products)
      const newOrder = new this.model_order(orderToAdd);
      const savedOrder = await newOrder.save();
      const orderID = savedOrder._id.toString();
      const orderTotal = orderToAdd.total
      logger.info(`Nueva orden generada con exito!: ${orderID}`);

      await Email_NewOrder(user, cart, orderID, orderTotal)
      .then(() => {
        logger.info("Email de aviso de nueva orden enviado con exito!");
      })
      .catch((error) => logger.error(error));

      return orderID;
    } catch (error) {
      logger.error(`Error en la creación de nueva orden: ${error}`);
      return { Error: "Error en la creación de nueva orden" };
    }
  }

  async OrdersById(idUser){
    try{
      const orders = await this.model_order.find({ 'user.userID': idUser });
      return orders
    }catch(err){
      logger.error(`Error al listar ordenes por ID en DAO: ${err}`)
    }
  }
}

export default OrdersDaoMongoDB;
