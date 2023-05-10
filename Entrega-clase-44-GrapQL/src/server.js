import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import minimist from "minimist";
import os from "os";
import cluster from "cluster";
import {logger}  from "./config/winston_config.js";
import {PassportLogic}  from "./config/passport_config.js";
import  {checkAuthentication}  from "./config/passport_config.js";
import RouterSession from "./router/session_router.js";
import RouterTest from "./router/test_router.js"
import RouterProductos from "./router/products_router.js"
import RouterMensajes from "./router/mensajes_router.js"
import { engine } from "express-handlebars";
import { dirname } from 'path';
import { fileURLToPath} from 'url';
import  {urlMongoDB}  from "./config/dotenv_config.js"
import mongoose from "mongoose";
import getConnectionMongoDB from "./DB/connection.js";
import bodyParser from "body-parser";

const connection = getConnectionMongoDB();
await connection.MongoDB_Connect();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const numCPUs = os.cpus().length;
const args = minimist(process.argv.slice(2), []);
const app = express();
const server = createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//MOTOR DE PLANTILLA
app.engine(
  "hbs",
  engine({
    extname: "*.hbs",
    defaultLayout: "index.hbs",
  })
);
app.set('views', __dirname + '/views')
app.set("view engine", "hbs");

app.use(express.static("../public"));

//GUARDA LA SESSION EN MONGODB
mongoose.set("strictQuery", false);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: urlMongoDB,
    }),
    secret: "secret-key",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 10000 }, // 10 minutos
    rolling: true,
  })
);

//PASSPORT
app.use(passport.session());
app.use(passport.initialize());
PassportLogic()

app.use("/api/test", RouterTest);
app.use("/session", RouterSession);
app.use("/api/productos", RouterProductos);
app.use("/api/mensajes", RouterMensajes);


//INICIO
app.get("/", checkAuthentication, (req, res) => {

  req.session.cookie.expires = new Date(Date.now() + 600000);

  let user = req.session.user;

  //BOOLEANO PARA LA URL DE LA IMAGEN DEL AVATAR, YA QUE DEPENDE DE SI EL HOST ES LOCAL O REMOTO.
  let hostBoolean = req.hostname == 'localhost' ? true : false;
  
  let url = {protocol: req.protocol, host: req.hostname, port: server.address().port, hostBoolean}

  let toRender = {...user, ...url}

  res.render("inicio", { toRender });
});

//En el caso de requerir una ruta no implementada en el servidor:
app.use("*", (req, res) => {
  logger.warn(
    `Se ha recibido una petición ${req.method} en la ruta ${req.originalUrl} que no existe`
  );
  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  res.status(404).send({
    error: -2,
    description: `ruta ${fullUrl} método ${req.method} no implementada`,
  });
});

//SERVIDOR
// ----------------------------------------------|

const modo = args["m"];

const PORT = args._[0] || args["port"] || args["p"] || 8080;

if (modo == "cluster" && cluster.isPrimary) {
  console.log(
    `Worker maestro ejecuntadose con pid ${process.pid}. Server listening on ${PORT}`
  );

  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker died: ${worker.process.pid}`);
    cluster.fork();
  });
} else {
  server.listen(PORT, () => {
    console.log(
      `Servidor escuchando en el puerto ${PORT}. PID: ${process.pid}`
    );
  });

  server.on("error", (error) => {
    console.log(`Error en servidor: ${error}`);
  });
}
