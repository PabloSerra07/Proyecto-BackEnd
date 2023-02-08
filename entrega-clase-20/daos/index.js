
const ProductosDAOFirebase = require('../daos/productos/ProductosDAOFirebase');
const CarritoDAOFirebase = require(`../daos/carritos/CarritoDAOFirebase`);

const ProductosDAOMongoDB = require(`../daos/productos/ProductosDAOMongoDB`);
const CarritoDAOMongoDB = require(`../daos/carritos/CarritoDAOMongoDB`);

const getStorage = () => {
//agrego el .env de storage

const dotenv = require('dotenv');
dotenv.config();
console.log(`Storage elegido... ${process.env.STORAGE}`);

const storage = process.env.STORAGE;
 
//console.log(storage)

    switch (storage) {
        case `firebase`:
            return {
                productos: new ProductosDAOFirebase(),
                carrito: new CarritoDAOFirebase()
            }
            break
        case `MongoDB`:
            return {
                productos: new ProductosDAOMongoDB(),
                carrito: new CarritoDAOMongoDB()
            }
            break

        default:
            return {
                productos: new ProductosDAOFirebase(),
                carrito: new CarritoDAOFirebase()
            }
            break
    }
}

module.exports = getStorage;