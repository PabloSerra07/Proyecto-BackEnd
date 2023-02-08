const express = require(`express`);
console.clear();
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);


//Routers import
const productosRouter = require("./routes/productosRouter");
const carritoRouter = require("./routes/carritoRouter");
const { credential } = require('firebase-admin');

//Routers
app.use(`/api/productos`, productosRouter);
app.use(`/api/carrito`, carritoRouter);

app.use(express.static(`public`));

app.use((req, res, next) => {
    res.status(404).json({ error: -2, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no implementada` });
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => 

console.log(`Servidor HHTP escuchando puerto ${PORT}`));

server.on(`error`, err => console.log(`error en el servidor ${err}`));


