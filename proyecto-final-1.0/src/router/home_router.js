import { Router } from "express";
import { Home_controller } from "../controllers/home_controller.js";
import compression from "compression";
import { checkAuthentication } from "../../config/passport_config.js";

const gzipMiddleware = compression();
const router = Router();

router.get("/", checkAuthentication, gzipMiddleware, Home_controller);

export default router;
