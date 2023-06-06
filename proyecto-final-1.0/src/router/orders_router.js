import { Router } from "express";
import {
    CreateOrder_controller,
    OrdersById_controller
} from "../controllers/order_controller.js";

const router = Router();

router.post("/:idCart/neworder/:idUser", CreateOrder_controller);

router.get("/:idUser", OrdersById_controller)

export default router;