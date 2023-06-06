import { logger } from "../../config/winston_config.js";
import cart_repository from "../repository/cart_repository.js";

export const AssignsCartID_controller = async (req, res) => {
  try {
    let { userID } = req.params;
    const productos = await cart_repository.assignsCartID(userID);
    res.json(productos);
  } catch (err) {
    logger.error(err);
  }
};

export const CreateCart_controller = async (req, res) => {
  try {
    const newCartID = await cart_repository.create(userID);
    res.json(newCartID);
  } catch (err) {
    logger.error(err);
  }
};

export const DeleteCart_controller = async (req, res) => {
  try {
    let { cartID } = req.params;
    let { userID } = req.params;
    const userID_ = await cart_repository.deleteCart(cartID, userID);
    res.json(userID_);
  } catch (err) {
    logger.error(err);
  }
};

export const GetProdsFromCart_controller = async (req, res) => {
  try {
    let { idCart } = req.params;
    const prods = await cart_repository.getProds(idCart);
    res.json(prods);
  } catch (err) {
    logger.error(err);
  }
};

export const AddProdToCart_controller = async (req, res) => {
  try {
    let { idCart } = req.params;
    let { idProd } = req.params;
    const cart = await cart_repository.addProdToCart(idCart, idProd);
    res.json(cart);
  } catch (err) {
    logger.error(err);
  }
};

export const DeleteProdFromCart_controller = async (req, res) => {
  try {
    let { idCart } = req.params;
    let { idProd } = req.params;
    const cart = await cart_repository.deleteProdfromCart(idCart, idProd);
    res.json(cart);
  } catch (err) {
    logger.error(err);
  }
};
