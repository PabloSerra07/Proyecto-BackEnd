import { prods_Model } from "../models/productos/productos_model.js";
import  {faker}  from "@faker-js/faker";
import { logger } from "../config/winston_config.js";
faker.locale = "es";

class ProductsDaoMongoDB {
  constructor() {
    this.model = prods_Model;
  }

  //PRODS
  //Lista todos los productos.
  async GetProds() {
    try {
      let data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(`Error en la API de productos: ${error}`);
    }
  }

  //crea un producto. Recibe title, brand, price, thumbnail y stock.
  async CreateProd(prodtoAdd) {
    try {
      const newProd = new this.model(prodtoAdd);
      await newProd.save();
      console.log("Producto creado con exito");
      return newProd;
    } catch (error) {
      logger.error(`Error en la API de productos: ${error}`);
    }
  }

  //TEST
  FakeProds() {
    const RandomProd = () => {
      return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: "https://dummyimage.com/300",
      };
    };
    const products = [];
    for (let i = 0; i < 5; i++) {
      products.push(RandomProd());
    }
    return products;
  }
}
export default ProductsDaoMongoDB;