import { ListarMsjs_controller, guardarMsj_controller } from "../controllers/mensajes_controller.js"
import { Router } from "express";

const router = Router();

router.get("/", ListarMsjs_controller)

router.post("/save", guardarMsj_controller)

export default  router