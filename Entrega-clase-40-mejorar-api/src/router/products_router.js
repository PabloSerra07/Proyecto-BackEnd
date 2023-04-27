import { GetProds_controller, CreateProd_controller } from "../controllers/productos_controller.js"
import { Router } from "express";

const router = Router();

router.get("/", GetProds_controller)

router.post("/save", CreateProd_controller)

export default  router