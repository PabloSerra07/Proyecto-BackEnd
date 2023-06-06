import express from "express";
import os from "os";
import { createServer } from "http";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import { logger } from "../config/winston_config.js";
import minimist from "minimist";
import RouterProds from "./router/products_router.js";
import RouterCart from "./router/carts_router.js";
import RouterSession from "./router/session_router.js";
import RouterOrders from "./router/orders_router.js";
import RouterHome from "./router/home_router.js";
import RouterMessages from "./router/messages_router.js"
import { session_key, urlMongoDB } from "../config/dotenv_config.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cluster from "cluster";
import { PassportLogic } from "../config/passport_config.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import getConnectionMongoDB from "./DB/connection.js";
import { Server } from "socket.io";

const connection = getConnectionMongoDB();
await connection.MongoDB_Connect();

const app = express();
export const server = createServer(app);
export const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const publicPath = join(__dirname, "..", "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine(
  "hbs",
  engine({
    extname: "*.hbs",
    defaultLayout: "index.hbs",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(express.static(publicPath));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: urlMongoDB,
    }),
    secret: session_key,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 10000 },
    rolling: true,
  })
);

app.use(passport.session());
app.use(passport.initialize());
PassportLogic();

app.use("/api/products", RouterProds);
app.use("/api/cart", RouterCart);
app.use("/session", RouterSession);
app.use("/orders", RouterOrders);
app.use("/chat", RouterMessages)
app.use("/", RouterHome);

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
