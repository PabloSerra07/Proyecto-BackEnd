import express from "express";
import os from "os";
import { createServer } from "http";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import { logger } from "./config/winston_config.js";
import minimist from "minimist";
import RouterProds from "./router/products_router.js";
import RouterCart from "./router/carts_router.js";
import RouterSession from "./router/session_router.js";
import { urlMongoDB, sessionKey } from "./DB/connection.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cluster from "cluster";
import { PassportLogic, checkAuthentication } from "./config/passport_config.js";
import { dirname } from 'path';
import { fileURLToPath} from 'url';
import compression from "compression";

const gzipMiddleware = compression();

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use(express.static(__dirname + "/public"));

//GUARDA LA SESSION EN MONGODB
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: urlMongoDB,
    }),
    secret: sessionKey,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 10000 }, // 10 minutos
    rolling: true,
  })
);

//PASSPORT
app.use(passport.session());
app.use(passport.initialize());
PassportLogic();

//ROUTERS
app.use("/api/products", RouterProds);
app.use("/api/cart", RouterCart);
app.use("/session", RouterSession);

app.get("/", checkAuthentication, gzipMiddleware, (req, res) => {
  
  req.session.cookie.expires = new Date(Date.now() + 600000);

  let user = req.session.user;

  //BOOLEANO PARA LA URL DE LA IMAGEN DEL AVATAR, YA QUE DEPENDE DE SI EL HOST ES LOCAL O REMOTO.
  let hostBoolean = req.hostname == 'localhost' ? true : false;
  
  let url = {protocol: req.protocol, host: req.hostname, port: server.address().port, hostBoolean}

  let toRender = Object.assign({}, user, url);

  res.render("inicio", { toRender });

});

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

//INICIAMOS EL SERVIDOR // FORK O CLUSTER.

const args = minimist(process.argv.slice(2), []);
const numCPUs = os.cpus().length;
const modo = args["m"];
const PORT = args._[0] || args["port"] || args["p"] || 8080;

if (modo == "cluster" && cluster.isPrimary) {
  logger.info(
    `Worker maestro ejecuntadose con pid ${process.pid}. Server listening on ${PORT}`
  );

  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    logger.info(`Worker died: ${worker.process.pid}`);
    cluster.fork();
  });
} else {
  server.listen(PORT, () => {
    logger.info(
      `Servidor escuchando en el puerto ${PORT}. PID: ${process.pid}`
    );
  });

  server.on("error", (error) => {
    logger.error(`Error en servidor: ${error}`);
  });
}