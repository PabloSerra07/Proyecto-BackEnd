import  RouterProducto  from "./productos.js"
import RouterCarrito from "./carrito.js";
import express from 'express';


const index = express.Router()

index.use('/productos', RouterProducto)


index.use('/carrito', RouterCarrito)


export default index;

