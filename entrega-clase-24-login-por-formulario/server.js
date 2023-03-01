import express from "express";
import ApiProdsSQL from "./api/productos.js";
import ApiMsjMongoDB from "./api/mensajes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const server = createServer(app);
const io = new Server(server);

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
      mongoUrl:
      'mongodb+srv://pablo:pablo@cluster0.glswgtz.mongodb.net/?retryWrites=true&w=majority',
    }),
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 10000 }, // 10 minutos
    rolling: true
  })
);

const apiProdsSQL = new ApiProdsSQL();

const apiMsjMongoDB = new ApiMsjMongoDB();

//PRODUCTOS - MariaDB
// CORROBORA SI EXISTE LA TABLA "PRODUCTOS", SI NO EXISTE, LA CREA.
apiProdsSQL.crearTablaProds();

//MENSAJES - MONGODB ATLAS.

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {

  req.session.username = req.body.name;

  res.redirect("/");
});

app.get("/", (req, res, next) => {

  if(req.session && req.session.username){
    req.session.cookie.expires = new Date(Date.now() + 600000);

    const nombre = req.session.username;
    res.render("inicio", { nombre });

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

app.post("/logout", (req, res) => {
  const nombre = req.session.username;
  req.session.destroy(error => {
    if(error){
      res.send({error: error.message});
      return;
    }else{
      res.render("logout", {nombre})
    }
  });
});

//SERVIDOR
// ----------------------------------------------|

const PORT = 8080;

const srv = server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${srv.address().port}`);
});

server.on("error", (error) => {
  console.log(`Error en servidor: ${error}`);
});
