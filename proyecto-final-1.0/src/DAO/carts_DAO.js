import { cart_Model } from "../models/cart_model.js";
import { user_Model } from "../models/user_model.js";
import { prods_Model } from "../models/product_model.js";
import { logger } from "../../config/winston_config.js";
import { cartDTO } from "../DTO/cart_DTO.js";

class CartsDaoMongoDB {
  constructor() {
    this.model_cart = cart_Model;
    this.model_user = user_Model;
    this.model_prods = prods_Model;
  }

  async GetCarts() {
    try {
      let data = await this.model_cart.find({});
      return data;
    } catch (error) {
      logger.error(`Error en operacion de base de datos: ${error}`);
      return { error: "Error en operacion de base de datos" };
    }
  }

  async ListById(id) {
    try {
      const data = await this.model_cart.findById(id);
      return data;
    } catch (error) {
      logger.error(`Error al listar los datos: ${error}`);
      return { error: `Error al listar los datos: ${error}` };
    }
  }

  async CreateCart() {
    try {
      const cartToAdd = cartDTO()
      const newCart = new this.model_cart(cartToAdd);
      const savedCart = await newCart.save();
      logger.info("Carrito creado con exito");
      return savedCart._id.toString();
    } catch (error) {
      logger.error(`Error en la creación del carrito: ${error}`);
      return { error: `Error en la creación del carrito: ${error}` };
    }
  }

  async assignsCartID(userID) {
    try {
      const user = await this.model_user.find({ _id: userID });
      const userCart = user[0].cartID;
      if (!userCart.length > 0) {
        const cartToAdd = cartDTO();
        const newCart = new this.model_cart(cartToAdd);
        const savedCart = await newCart.save();

        const userToUpdate = { _id: userID };
        const update = { cartID: savedCart._id.toString() };
        await this.model_user.updateOne(userToUpdate, update);

        logger.info("Carrito creado con exito y asignado a usuario");

        return [savedCart];
      } else {
        const cart = await this.model_cart.find({ _id: userCart });
        return cart;
      }
    } catch (error) {
      logger.error(`Error al asignarle el ID de carrito al usuario: ${error}`);
      return error;
    }
  }

  async GetProds(idCart) {
    try {
      const cart = await this.model_cart.findById(idCart);
      return cart.products;
    } catch (error) {
      logger.error(`Error al listar el carrito: ${error}`);
      return { error: `Error al listar el carrito: ${error}` };
    }
  }

  async addProdToCart(idCart, idProd) {
    const prod = await this.model_prods.findById(idProd);
    try {
      const cart = await this.model_cart.findById(idCart);
      const prodsArray = cart.products;
      prodsArray.push(prod);
      await this.model_cart.updateOne(
        { _id: idCart },
        { products: prodsArray }
      );
      logger.info("Producto agregado con exito");
      return cart;
    } catch (error) {
      logger.error(`Error al insertar un producto en el carrito: ${error}`);
      return { error: `Error al insertar un producto en el carrito: ${error}` };
    }
  }

  async DeleteProd_cart(idCart, idProd) {
    try {
      const cart = await this.model_cart.findById(idCart);
      const prodsArray = cart.products;
      const update = prodsArray.filter((p) => p._id != idProd);
      await this.model_cart.updateOne({ _id: idCart }, { products: update });
      logger.info("Producto eliminado");
      return cart;
    } catch (error) {
      logger.error(`Error al eliminar: ${error}`);
      return { error: "Error" };
    }
  }

  async DeleteCart(cartID, userID) {
    try {
      await this.model_cart.deleteOne({ _id: cartID });
      logger.info(`Carrito con id: ${cartID}, Eliminado con exito`);

      await this.model_user.updateOne(
        { _id: userID },
        { $set: { cartID: "" } }
      );

      logger.info(`CartID eliminado`);
      return userID;
    } catch (error) {
      logger.error(`Error al eliminar: ${error}`);
      return { Error: "Error al eliminar" };
    }
  }
}

export default CartsDaoMongoDB;
