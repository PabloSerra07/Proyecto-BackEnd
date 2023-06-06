import products_repository from "../repository/products_repository.js"
import { logger } from "../../config/winston_config.js"

export const GetProds_controller = async (req, res) => {
  try{
    const productos = await products_repository.find();
    res.json(productos);
  }catch(err){
    logger.error(`Error al listar los productos en el CONTROLLER ${err}`);
  }
};

export const GetProdsByID_controller = async (req, res) => {
  try{
    let {id} = req.params;
    const producto = await products_repository.findByID(id);
    res.json(producto);
  }catch(err){
    logger.error(err);
  }
}

export const CreateProd_controller = async (req, res) => {
  try{
    const data = req.body
    const result = await products_repository.save(data)

    if (result.code === 409) {
      return res.status(409).json(result);
    }

    return res.json(result)
  }catch(err){
    logger.error(err);
  }
}

export const UpdateProd_controller = async (req, res) => {
  try{
    const data = req.body 
    const {id} = req.params
    const prodUpdate = await products_repository.update(id, data)
    res.json(prodUpdate)
  }catch(err){
    logger.error(err)
  }
}

export const DeleteProd_controller = async (req, res) => {
  let {id} = req.params;
  try{
    const result = await products_repository.delete(id)
    return res.json(result)
  }catch(err){
    logger.error(err);
  }
}