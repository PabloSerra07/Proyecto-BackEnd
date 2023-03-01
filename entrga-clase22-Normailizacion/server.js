import express from "express";
import ApiProdsSQL from "./api/productos.js";
import ApiMsjMongoDB from "./api/mensajes.js";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);

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

const apiProdsSQL = new ApiProdsSQL();

const apiMsjMongoDB = new ApiMsjMongoDB();

//BASE DE DATOS
// ----------------------------------------------|

//PRODUCTOS - MariaDB
// CORROBORA SI EXISTE LA TABLA "PRODUCTOS", SI NO EXISTE, LA CREA.
apiProdsSQL.crearTablaProds();

//MENSAJES UTILIZA MONGODB ATLAS.

//FUNCIONALIDADES
// ----------------------------------------------|

app.get("/", (req, res) => {
  res.render("formulario");
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
});

//MOCK - FAKE PRODS
app.get("/api/productos-test", (req, res) => {
  const productosFake = apiProdsSQL.FakeProds();
  res.render("productos-test", { productosFake });
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
