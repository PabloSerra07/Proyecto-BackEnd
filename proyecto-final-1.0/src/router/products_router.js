import { Router } from "express";
import {
  GetProds_controller,
  GetProdsByID_controller,
  CreateProd_controller,
  UpdateProd_controller,
  DeleteProd_controller,
} from "../controllers/products_controller.js";

const router = Router();

router.get("/", GetProds_controller);

router.get("/:id", GetProdsByID_controller);

router.post("/", CreateProd_controller);

router.put("/:id", UpdateProd_controller);

router.delete("/:id", DeleteProd_controller);

export default router;
