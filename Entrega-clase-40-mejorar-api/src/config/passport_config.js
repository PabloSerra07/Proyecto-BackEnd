import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { logger } from "./winston_config.js";
import {
  FindUser_controller,
  SaveUser_controller,
} from "../controllers/session_controller.js";

export function PassportLogic() {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (email, password, done) => {
        console.log(`${email}, ${password}`);
        function isValidPassword(user, password) {
          return bcrypt.compareSync(password, user.password);
        }
        try {
          const user = await FindUser_controller(email);

          if (!user) {
            return done(null, false, {
              message:
                "No se ha encontrado un usuario registrado con ese correo",
            });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, {
              message: "La contraseña es incorrecta",
            });
          }
          logger.info(`Usuario: ${user.username} ingresa con exito`);
          return done(null, user);
        } catch (err) {
          logger.error(`Error en la estrategia de registro: ${err}`);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        const { name, address, age, phone_number } = req.body;
        try {
          const user = await FindUser_controller();

          if (user) {
            return done(null, false, {
              message: "El correo electrónico ya está registrado",
            });
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const imagen = req.file ? `/images/${req.file.filename}` : `/images/default.png`;

          await SaveUser_controller(
            name, 
            email, 
            hashedPassword, 
            address, 
            age, 
            phone_number, 
            imagen
          );

          return done(null, newUser);
        } catch (err) {
          logger.error(`Error en la estrategia de registro: ${err}`);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await user_Model.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

export function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/session/login");
  }
}
