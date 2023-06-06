import { logger } from "../../config/winston_config.js"
import order_repository from "../repository/order_repository.js"

export const CreateOrder_controller = async (req, res) => {
    try{
        let { idUser } = req.params;
        let { idCart } = req.params;
        const orderID = await order_repository.create(idUser, idCart)
        console.log(orderID);
        res.json(orderID)
    }catch(err){
        logger.error(`Error en el controller al crear una orden ${err}`)
    }
}

export const OrdersById_controller = async (req, res) => {
    try{
        const { idUser } = req.params;
        const orders = await order_repository.ListById(idUser)
        res.json(orders) 
    }catch(err){
        logger.error(`Error en el controller al listar ordenes del usuario ${err}`)
    }
}