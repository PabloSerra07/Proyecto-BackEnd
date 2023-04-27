import ProductosFactory from "../factory/productos_factory.js";
import {productosDTO} from "../DTO/productos_DTO.js"

// const productos_factory_DAO = ProductosFactory.getDAO();

export const GetProds_controller = async (req, res) => {
  const productos = await productos_factory_DAO.GetProds();
  res.json(productos);
};

export const CreateProd_controller = async (req, res) => {
  const data = req.body
  const prodToAdd = productosDTO(data)
  const addedProd = await productos_factory_DAO.CreateProd(prodToAdd)
  return addedProd
}