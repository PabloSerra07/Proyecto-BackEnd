import { Router } from "express";
import {
  AssignsCartID_controller,
  CreateCart_controller,
  DeleteCart_controller,
  GetProdsFromCart_controller,
  AddProdToCart_controller,
  DeleteProdFromCart_controller
} from "../controllers/cart_controller.js"

const router = Router();

router.post("/:userID", AssignsCartID_controller);

router.post("/", CreateCart_controller);

router.delete("/:cartID/user/:userID", DeleteCart_controller);

router.get("/:idCart/products", GetProdsFromCart_controller);

router.post("/:idCart/products/:idProd", AddProdToCart_controller);

router.delete("/:idCart/products/:idProd", DeleteProdFromCart_controller);

export default router