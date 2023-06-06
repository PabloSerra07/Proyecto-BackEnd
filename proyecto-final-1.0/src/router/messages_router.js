import { Router } from "express";
import {
  ListMsjsByEmail_controller,
  WebSocket_controller
} from "../controllers/messages_controller.js";
import { checkAuthentication } from "../../config/passport_config.js";

const router = Router();

router.get("/", checkAuthentication, WebSocket_controller);

router.get("/:email", ListMsjsByEmail_controller);

export default router;
