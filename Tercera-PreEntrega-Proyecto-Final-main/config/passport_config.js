import mongoose from "mongoose";
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { UserSchema } from "../DB/schemas.js";
import { MongoDB_Connect } from "../DB/connection.js";
import { logger } from "./winston_config.js"
import { Email_NewUser } from "../config/nodemailer_config.js"

const model = mongoose.model("users", UserSchema);

export function PassportLogic() {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const isValidPassword = (user, password) => {
          return bcrypt.compareSync(password, user.password);
        };
        try {
          await MongoDB_Connect();
          const user = await model.findOne({ email: email });
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
          await MongoDB_Connect();
          const user = await model.findOne({ email: email });
          if (user) {
            return done(null, false, {
              message: "El correo electrónico ya está registrado",
            });
          } 
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          
          const newUser = new model({
            username: name,
            email,
            password: hashedPassword,
            address,
            age,
            phone_number: `+54${phone_number}`,
            image: req.file
              ? `/images/${req.file.filename}`
              : `/images/default.png`,
            cartID: ""
          });

          await newUser.save();
          
          logger.info(`Usuario: ${name} registrado con exito!`);

          //ENVIA UN MAIL AL ADMIN NOTIFICANDO UN NUEVO REGISTRO.
          Email_NewUser(newUser)
          .then(()=>{logger.info('Email de aviso de registro enviado con exito!')})
          .catch(err => logger.error(err))

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
      const user = await model.findById(id);
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
