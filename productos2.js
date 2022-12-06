const Contenedor = require('./entrega02');
const productos = new Contenedor('./productos.txt');

productos.save({
    title: "super mario",
    price:100
});