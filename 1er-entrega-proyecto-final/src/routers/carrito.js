
import express from "express";
import {createHash} from "crypto"
import pkg from "lodash";
import productos from "./productos.js";

const {map, remove} = pkg

let productosCarrito =  []

let RouterCarrito = express.Router();

RouterCarrito.post('/', (req,res) => {
    try{
        const indice = createHash('sha256').update((Math.random() + 1).toString(36).substring(7)).digest("hex")
        productosCarrito[indice] = {}
        res.json(indice).status(200)
    }catch (e)
    {
        console.log(e)
        res.status(400).json('Error')
    }
})

RouterCarrito.delete('/:id',(req,res) =>{
    let { id } = req.params
    if(productosCarrito[id]){
        productosCarrito[id] = {}
        productosCarrito.remove(id)
        res.status(200).json("!!! Carrito Eliminado")
    }
    res.status(404).json("nose no se encontro")
})

RouterCarrito.get('/:id/productos', (req,res)=>{
    try{
        let {id} = req.params;
        res.status(200).json(productosCarrito[id])
    }
    catch(e){
        res.status(400).json('error')
    }
})

RouterCarrito.post('/:idCar/productos/', (req,res)=>{
    try{
        let {idCar} = req.params;
        const productToAdd = req.body;


        if(productosCarrito[idCar][productToAdd.id]){
            productosCarrito[idCar][productToAdd.id].count++
        } else {
            productosCarrito[idCar][productToAdd.id] = {
                product: productToAdd,
                count:1
            }
        }

        res.status(200).json(productosCarrito[idCar][productToAdd.id])
    } catch(err) {
        console.log(err)
        res.status(404).json("Error")
    }

})

RouterCarrito.delete('/:idCarrito/productos/:id_prod', (req, res)=>{
    try{
        //check peticion
        let {idCarrito, id_prod} = req.params;


        //modificar peticion productosCarrito idCarrito productosCarrito[idCarrito]
        /**/
        if(productosCarrito && productosCarrito[idCarrito] && productosCarrito[idCarrito][id_prod] && productosCarrito[idCarrito][id_prod].count > 0){
            productosCarrito[idCarrito][id_prod].count--
        } else {
            productosCarrito[idCarrito][id_prod].count = 0
        }


        //respuesta
        res.status(200).json('ok')

    }
    catch (e){ //error
        console.log(e)
        res.status(404)
    }
})


export default RouterCarrito

