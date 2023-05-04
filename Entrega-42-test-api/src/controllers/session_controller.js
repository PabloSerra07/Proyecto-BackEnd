import passport from "passport";
import  {checkAuthentication}  from "../config/passport_config.js";
import {upload}  from "../config/multer_config.js";
import session_repository from "../repository/session_repository.js"
import {logger} from "../config/winston_config.js"

export const Login_Render_controller = (req, res) => {
  res.render("login");
};

// export const Login_Authenticate_controller = (req, res) => {
//   passport.authenticate("login", {
//     failureRedirect: "/session/faillogin",
//   }),
//     () => {
//       const user = req.user;
//       req.session.user = user;
//       res.redirect("/");
//     };
// };

export const Login_Authenticate_controller = (req, res, next) => {
  passport.authenticate("login", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/session/faillogin");
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      logger.info(`Usuario: ${user.username} ingresa con exito`);
      req.session.user = user;
      return res.redirect("/");
    });
  })(req, res, next);
};

export const Register_Render_controller = (req, res) => {
  res.render("register");
};

// export const Register_Authenticate_controller = (req, res) => {
//   upload.single("image"),
//     passport.authenticate("register", {
//       failureRedirect: "/session/failregister",
//     }),
//     () => {
//       req.session.destroy((error) => {
//         if (error) {
//           logger.error(`Error al destruir la session ${error}`);
//           return;
//         }
//       });
//       res.redirect("/session/login");
//     };
// };

export const Register_Authenticate_controller = (req, res, next) => {
  upload.single("image")(req, res, () => {
    passport.authenticate("register", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
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
  checkAuthentication(req, res, () => {
    const user = req.session.user;
    req.session.destroy((error) => {
      if (error) {
        logger.error(`Error al destruir la session ${error}`);
        return;
      } else {
        res.render("logout", { user });
      }
    });
  });
};

export const FindUser_controller = async (email) => {
  const user = await session_repository.findOne(email);
  return user;
};

export const SaveUser_controller = async (userData) => {
  await session_repository.save(userData);
};
