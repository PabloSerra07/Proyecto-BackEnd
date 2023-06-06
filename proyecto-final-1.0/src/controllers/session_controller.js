import passport from "passport";
import { upload } from "../../config/multer_config.js";
import session_repository from "../repository/session_repository.js";
import { logger } from "../../config/winston_config.js";

export const Login_Render_controller = (req, res) => {
  res.render("login");
};

export const Login_Authenticate_controller = (req, res, next) => {
  passport.authenticate("login", (err, access_token) => {
    if (err) {
      logger.error(`Error en la autenticación de login (controller): ${err}`);
      return (
        res.redirect("/session/faillogin")
      );
    }
    if (!access_token) {
      return (
        res.redirect("/session/faillogin")
      );
    }
    res.cookie('token', access_token, { expires: new Date(Date.now() + 600000) });
    return res.redirect("/");
  })(req, res, next);
};

export const Register_Render_controller = (req, res) => {
  res.render("register");
};

export const Register_Authenticate_controller = (req, res, next) => {
  upload.single("image")(req, res, () => {
    passport.authenticate("register", (err, access_token) => {
      console.log("se ejecuta Register_Authenticate_controller");
      if (err) {
        logger.error(`Error en Register_Authenticate_controller: ${err}`)
        return res.redirect("/session/failregister");
      }
      if(!access_token){
        return res.redirect("/session/failregister");
      }
      req.session.destroy((error) => {
        if (error) {
          logger.error(`Error al destruir la session ${error}`);
          return;
        }
      });
      res.redirect("/session/login");
    })(req, res, next);
  });
};

export const Login_Fail_controller = (req, res) => {
  res.render("failLogin");
};

export const Register_Fail_controller = (req, res) => {
  res.render("failRegister");
};

export const Logout_controller = (req, res) => {
  const user = req.session.user;
  req.session.destroy((error) => {
    if (error) {
      logger.error(`Error al destruir la session ${error}`);
      return;
    } else {
      res.clearCookie('token');
      res.render("logout", { user });
    }
  });
};

export const FindUser_controller = async (email) => {
  const user = await session_repository.findOne(email);
  return user;
};

export const SaveUser_controller = async (userData) => {
  await session_repository.save(userData);
};
