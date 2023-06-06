import { prods_Model } from "../models/product_model.js";
import { logger } from "../../config/winston_config.js";

class ProductsDaoMongoDB {
  constructor() {
    this.model = prods_Model;
  }

  async GetProds() {
    try {
      let data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(`Error en base de datos: ${error}`);
      return { error: "Error base de datos" };
    }
  }

  async ProdById(id) {
    try {
      const data = await this.model.findById(id);
      return data;
    } catch (error) {
      logger.error(`Error producto por ID: ${error}`);
      return { error: `Error producto por ID: ${error}` };
    }
  }

  async CreateProd(prodtoAdd) {
    try {
      const existingProduct = await this.model.findOne({
        title: prodtoAdd.title,
      });

      if (existingProduct) {
        logger.info(`El producto ya existe ${prodtoAdd.title}`);
        return {
          code: 409,
          message: `El producto ya existe ${prodtoAdd.title}`,
        };
      }

      const newProd = new this.model(prodtoAdd);
      const prodSaved = await newProd.save();
      logger.info("Producto creado con exito");
      return prodSaved._id.toString();
    } catch (error) {
      logger.error(`El producto ya existe: ${error}`);
      return { error: `El producto ya existe: ${error}` };
    }
  }

  async UpdateProd(id, obj) {
    try {
      await this.model.updateOne({ _id: id }, obj);
      const prods = await this.model.find({});
      logger.info("Producto actualizado");
      return prods;
    } catch (error) {
      logger.error(`Error al actualizar producto: ${error}`);
      return { error: "Error en la actualización del producto" };
    }
  }

  async DeleteProd(id) {
    try {
      await this.model.deleteOne({ _id: id });
      logger.info(`Objeto con id: ${id}, Eliminado con exito`);
      return await this.model.find({});
    } catch (error) {
      logger.error(`Error en la API de productos: ${error}`);
      return { Error: "Error en la eliminación del objeto" };
    }
  }
}

export default ProductsDaoMongoDB;
