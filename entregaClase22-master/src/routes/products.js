import express from 'express';
import Contenedor from '../controllers/contenedor.js';
import knex from '../controllers/knexProducts.js';


//---------- router ----------
const router = express.Router();


//-------- MIDD ---------
router.use(express.urlencoded({extended: true}));

router.use(express.json());

router.use((req, res, next) => {
  console.log(`Tiempo del producto: ${Date.now()}`)
  next()
});

//------CONTENEDOR -----
let products = new Contenedor(knex, 'products');

//------- RUTAS ------
router.get('/', async (req, res, next) => {
  res.render('formNewProduct');
});

router.get("/products", async (req, res, next) => {
  try {
    const arrayProduct = await products
      .getAll()
      .then((resolve) => resolve);
    if (arrayProduct.length === 0) {
      throw new Error("No hay products");
    }
    res.render('datos', {arrayProduct});
  } catch (err) {
    next(err);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const producto = await products
      .getById(Number(req.params.id))
      .then((resolve) => resolve);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    res.json(producto);
  } catch (err) {
    next(err);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const nombresValidos = /^[a-zA-Z0-9ÑñÁáÉéÍíÓóÚú\s]+$/;
    if (!req.body.title || !req.body.price || !req.body.thumbnail) {
      throw new Error("Debes enviar un producto con nombre, precio y URL");
    }
    if (req.body.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    if (!nombresValidos.exec(req.body.title)) {
      throw new Error('El nombre solo puede contener letras, números y espacios');
    }
    await products.save(req.body).then((resolve) => {
      res.redirect('/');
    });
  } catch (err) {
    next(err);
  }
});

router.put("/products/:id", async (req, res, next) => {
  try {
    const producto = await productos
      .getById(Number(req.params.id))
      .then((res) => res);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    await products
      .update(
        Number(req.params.id),
        req.body.title,
        req.body.price,
        req.body.thumbnail
      )
      .then((resolve) => {
        res.json(resolve);
      });
  } catch (err) {
    next(err);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const producto = await products
      .getById(Number(req.params.id))
      .then((resolve) => resolve);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    
    await products.deleteById(Number(req.params.id)).then((resolve) =>  {
       
      res.status(200).json({ message: `Producto con ID:${id} borrado con exito` });
   
    });
  } 
    catch (err) {
        next(err);
    }
  
});


function handleErrors(err, req, res, next) {
  console.log(err.message);
  res.status(500).send({ error: err.message });
}
router.use(handleErrors);


export default products;




