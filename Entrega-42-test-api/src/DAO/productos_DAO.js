import { prods_Model } from "../models/productos/productos_model.js";
import { faker } from "@faker-js/faker";
import {logger}  from "../config/winston_config.js";
faker.locale = "es";

class ProductsDaoMongoDB {
  constructor() {
    this.model = prods_Model;
  }

  //PRODS
  //Lista todos los productos.
  async GetProds() {
    try {
      let data = await this.model.find({}).sort({_id: -1})
      return data;
    } catch (error) {
      logger.error(`Error en la API de productos: ${error}`);
    }
  }

  //crea un producto. Recibe title, brand, price, thumbnail y stock.
  async CreateProd(prodtoAdd) {
    try {
      const existingProduct = await this.model.findOne({ title: prodtoAdd.title });

      if (existingProduct) {
        logger.info(`Ya existe un producto con el título ${prodtoAdd.title}`);
        return { code: 409, message: `Ya existe un producto con el título ${prodtoAdd.title}` };
      }

      const newProd = new this.model(prodtoAdd);
      await newProd.save();
      console.log("Producto creado con exito");
      return prodtoAdd;
    } catch (error) {
      logger.error(`Error en la API de productos: ${error}`);
    }
  }

  async DeleteProd(id){
    try{
      await this.model.deleteOne({ _id: id });
      logger.info(`Objeto con id: ${id}, ha sido eliminado con exito`)
      return await this.model.find({});
    }catch(error){
      logger.error(`Error en la API de productos: ${error}`);
    }
  }
}

export default ProductsDaoMongoDB;