import productos from "../utils/claseProducto.js"
import express from "express";

const RouterProducto = express.Router();

RouterProducto.get('/', (req,res) => {
    res.json(productos.listarAll())
})

RouterProducto.post('/guardar', (req,res) => {
    const  prod = req.body
    productos.guardar(prod)
    res.json(productos)
})

RouterProducto.put('/:id', (req,res) => {
    const {id} = req.params
    const prod = req.body
    productos.actualizar(prod,id)
    res.json(prod)
})
RouterProducto.delete('/:id', (req,res) => {
    let { id } = req.params
    let prod = productos.borrar(id)
    res.json(prod)
})

export default RouterProducto
