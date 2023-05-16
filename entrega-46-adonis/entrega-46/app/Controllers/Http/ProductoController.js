'use strict'

const Producto = use('App/Models/ProductosSchema')

class ProductoController {
    async index ({ request, response }) {
      const productos = await Producto.all();
      return response.json(productos);
    }
  
    async findByNumber ({ request, response }) {
      const number = request.params.number;
      const producto = await Producto.findBy('number', number);
      return response.json(producto);
    }
  
    async createProducto ({ request, response }) {
      const data = request.body;
      const { title, price, url_foto } = data;
      const producto = new Producto();
      producto.number = number;
      producto.title = title;
      producto.price = price;
      producto.url_foto = url_foto;
      producto.save();
      return response.json(producto);
    }
  
    async deleteProducto ({ request, response }) {
      const number = request.params.number;
      const producto = await Producto.findBy('number', number);
      await producto.delete();
      return response.json({
        message: `Producto ${number} deleted!`
      });
    }
  }
  
  module.exports = ProductoController
  
