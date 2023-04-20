import { Router } from "express";
import passport from "passport";
import { MongoDB_Disconnect } from "../DB/connection.js";
import { checkAuthentication } from "../config/passport_config.js";
import { upload } from "../config/multer_config.js"
import { logger } from "../config/winston_config.js"
const router = Router();

//LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/session/faillogin",
  }),
  (req, res) => {
    const user = req.user;
    req.session.user = user;
    res.redirect("/");
  }
);

//REGISTER
router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  upload.single("image"),
  passport.authenticate("register", {
    failureRedirect: "/session/failregister",
  }),
  (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        logger.error(`Error al destruir la session ${error}`);
        return;
      } 
    })
    res.redirect("/session/login");
  }
);

//FALLA AL LOGEAR
router.get("/faillogin", (req, res) => {
  res.render("failLogin");
});

//FALLA AL REGISTRAR
router.get("/failregister", (req, res) => {
  res.render("failRegister");
});

//DESLOGUEO
router.post("/logout", checkAuthentication, (req, res) => {
  const user = req.session.user;

  req.session.destroy((error) => {
    if (error) {
      logger.error(`Error al destruir la session ${error}`);
      return;
    } else {
      res.render("logout", { user });
    }
  });
  
  //SE DESCONECTA LA BASE DE DATOS
  MongoDB_Disconnect();
  
});

export default router;