import { GetProds_controller, CreateProd_controller, DeleteProd_controller } from "../controllers/productos_controller.js"
import { Router } from "express";

const router = Router();

router.get("/", GetProds_controller)

router.post("/save", CreateProd_controller)

router.delete("/delete/:id", DeleteProd_controller)

export default  router