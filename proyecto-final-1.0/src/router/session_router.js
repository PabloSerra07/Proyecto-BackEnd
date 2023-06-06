import { Router } from "express";
import {
  Login_Authenticate_controller,
  Login_Fail_controller,
  Login_Render_controller,
  Logout_controller,
  Register_Authenticate_controller,
  Register_Fail_controller,
  Register_Render_controller,
} from "../controllers/session_controller.js";
import { checkAuthentication } from "../../config/passport_config.js"

const router = Router();

router.get("/login", Login_Render_controller);

router.post("/login", Login_Authenticate_controller);

router.get("/register", Register_Render_controller);

router.post("/register", Register_Authenticate_controller);

router.get("/faillogin", Login_Fail_controller);

router.get("/failregister", Register_Fail_controller);

router.post("/logout", checkAuthentication, Logout_controller);

export default router;