import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { logger } from "./winston_config.js";
import {FindUser_controller, SaveUser_controller} from "../src/controllers/session_controller.js";
import { GenerateToken, DecodeToken } from "../config/jsonwebtoken.js";

export function PassportLogic() {

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
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
          const access_token = GenerateToken({ user });

          logger.info(`Usuario: ${user.username} ingresa con exito`);

          return done(null, access_token);
        } catch (err) {
          logger.error(`Error en la estrategia de login: ${err}`);
          return done(err);
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
          const user = await FindUser_controller(email);

          if (user) {
            return done(null, false, {
              message: "El correo electrónico ya está registrado",
            });
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const image = req.file
            ? `/images/${req.file.filename}`
            : `/images/asa.png`;

          const userData = {
            name,
            email,
            hashedPassword,
            address,
            age,
            phone_number,
            image,
          };

          await SaveUser_controller(userData);

          const access_token = GenerateToken({ userData })

          logger.info(`Usuario: ${userData.name} registrado con exito!`);

          return done(null, access_token);
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
      const user = await FindUser_controller(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

//UTILIZA JWT
export async function checkAuthentication(req, res, next) {
  try {  
    const access_token = req.cookies.token;
    if (!access_token) {
      return res.redirect("/session/login");
    }
    const UserFromToken = DecodeToken(access_token);
    const user = await FindUser_controller(UserFromToken.user._id);
    if (!user) {
      return res.redirect("/session/login");
    }
    next();
  } catch (err) {
    logger.error(`Error en checkAuthentication: ${err}`);
    next(err);
  }
}
