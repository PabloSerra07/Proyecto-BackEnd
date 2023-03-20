import express from "express";
import ApiProdsSQL from "./api/productos.js";
import ApiMsjMongoDB from "./api/mensajes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { createServer, request } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import path from "path";
import { fork } from "child_process";
import dotenv from "dotenv"; dotenv.config();
import minimist from "minimist";

//---------------------------------------------------------
import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';

//-------------------------------------
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Proceso Primario:  ${process.pid} está corriendo`);
  console.log(`Numero de nucleos : ${numCPUs}`);

   // Trabajadores.
for (let i = 0; i < numCPUs; i++) {
     
   }

  //  cluster.on('exit', (worker, code, signal) => {
  //        console.log(`worker ${worker.process.pid} died`);
//   });
  } else {
    cluster.fork();
    cluster.on('exit', (worker, code, signal) => {
   console.log(`Worker ${process.pid} started`);
 })
}

//---------------------------------------------------------


const args = minimist(process.argv.slice(2), []);

///env mongo///
const urlMongoDB = process.env.URLMONGODB;

///---------------////////////
const app = express();
const server = createServer(app);
const io = new Server(server);
const apiProdsSQL = new ApiProdsSQL();
const apiMsjMongoDB = new ApiMsjMongoDB();


//--CONFIGURACION Y CONEXION A MONGODB USUARIOS
mongoose.set("strictQuery", false);
const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    }
  },
  {
    versionKey: false,
  }
);

const model = mongoose.model("users", UserSchema);

//PRODUCTOS - MariaDB
// CORROBORA SI EXISTE LA TABLA "PRODUCTOS", SI NO EXISTE, LA CREA.
apiProdsSQL.crearTablaProds();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.engine(
  "hbs",
  handlebars.engine({
    extname: "*.hbs",
    defaultLayout: "index.hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("views/layouts"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: urlMongoDB,
    }),
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 10000 }, // 10 minutos
    rolling: true
  })
);

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {

  function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  try{
    const user = await model.findOne({email: email})
    if(!user){
      console.log('error: no se encontro user');
      return done(null, false);
    }
    if(!isValidPassword(user, password)){
      return done(null, false);
    }
    return done(null, user);
  }catch(err){
    return done('error en strategy 1: '+ err);
  }

}));

passport.serializeUser((user, done) => {
  console.log('serializeUser ejecutado');
  done(null, user.id);
});


passport.deserializeUser( async (id, done) => {
  console.log('deserializeUser ejecutado');

  try{
    const user = await model.findById(id)
    done(null, user)
  }catch(err){
    done(err)
  }
});


//LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/faillogin'
}));


//REGISTER
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  
  const {name, email, password} = req.body

  const user = {username: name, email: email, password: password}

  async function RegisterUser(password) {
    try {
      await mongoose.connect(urlMongoDB, {
        serverSelectionTimeoutMS: 1000,
      });
      try {
        let users = await model.find({});
        if (users.some((u) => u.email == user.email)) {
          console.log("El usuario ya existe");
          res.redirect("/failregister");
        } else {
          user.password = password;
          const newUser = new model(user);
          await newUser.save();
          console.log("Usuario registrado con exito");
          res.redirect("/login");
        }
      } catch (error) {
        console.log(
          `Error en la query de la base de datos, en funcion RegisterUser: ${error}`
        );
      }
    } catch (err) {
      console.log(
        `Error al conectar la base de datos en el "deserializeUser": ${err}`
      );
    } finally {
      mongoose.disconnect().catch((err) => {
        throw new Error("error al desconectar la base de datos");
      });
    }
  }

  //ENCRIPTO LA CONTRASEÑA
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    RegisterUser(hash)
  });

});

//INICIO
app.get("/", (req, res) => {

  if(req.session){

    req.session.cookie.expires = new Date(Date.now() + 600000);

    // const email = req.session.email;

    res.render("inicio", {});

    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado");
  
      //MSJS
  
      apiMsjMongoDB.ListarMsjs().then((msjs) => {
        socket.emit("mensajes", msjs);
      });
  
      socket.on("nuevo-mensaje", (data) => {
        apiMsjMongoDB
          .guardarMsj(data)
          .then(() => {
            console.log("Mensaje cargado en la base de datos");
            return apiMsjMongoDB.ListarMsjs();
          })
          .then((msj) => {
            io.sockets.emit("mensajes", msj);
            console.log("Vista de mensajes actualizada");
          });
      });
  
      //PRODS
  
      apiProdsSQL.ListarProds().then((prods) => {
        socket.emit("productos", prods);
      });
  
      socket.on("nuevo-producto", (data) => {
        apiProdsSQL
          .guardarProd(data)
          .then(() => {
            console.log("Producto cargado en la base de datos");
            return apiProdsSQL.ListarProds();
          })
          .then((prods) => {
            io.sockets.emit("productos", prods);
            console.log("Vista de productos actualizada");
          });
      });
    });

  }else{
    res.redirect("/login")
  };
});

//MOCK - FAKE PRODS
app.get("/api/productos-test", (req, res) => {
  const productosFake = apiProdsSQL.FakeProds();
  res.render("productos-test", { productosFake });
});

//FALLA AL LOGEAR
app.get("/faillogin", (req, res) => {
  res.render("faillogin");
});

//FALLA AL REGISTRAR
app.get("/failregister", (req, res) => {
  res.render("failregister");
});

//LOG OUT
app.post("/logout", (req, res) => {
  const nombre = req.session.username;
  req.session.destroy(error => {
    if(error){
      console.log(error);
      return;
    }else{
      res.render("logout", {nombre})
    }
  });
});
////// PROCESS ///////
app.get("/info", (req, res) => {
  const info = {
    args: args._[0] || args["port"] || args["p"] || JSON.stringify(args),
    platform: process.platform,
    version: process.version,
    memory: process.memoryUsage().rss,
    path: process.cwd(),
    pid: process.pid,
    folder: path.dirname(new URL(import.meta.url).pathname),
  };

  res.render("info", { info });
});

////CHILD PROCESS
app.get("/api/randoms", (req, res) => {
  const cant = Number(req.query.cant) || 10e7;

  const child = fork("./api/apiRandoms.js");

  child.send(cant);
  
  child.on("message", (result) => {

    res.json(result)

  });
});


//SERVIDOR
// ----------------------------------------------|


const PORT = args._[0] || args["port"] || args["p"] || 8080;

const srv = server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${srv.address().port}`);
});

server.on("error", (error) => {
  console.log(`Error en servidor: ${error}`);
});