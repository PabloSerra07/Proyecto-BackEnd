import { productsDaoMongoDB } from "../daos/index.js";
import { Router } from "express";

const router = Router();

//devuelve todos los productos
router.get("/", (req, res) => {
  productsDaoMongoDB.ListAll().then((data) => {
    res.json(data);
  });
});

// devuelve un producto según su id
router.get("/:id", (req, res) => {
  let { id } = req.params;

  productsDaoMongoDB.ListById(id).then((data) => {
    res.json(data);
  });
});

//recibe y agrega un producto, y lo devuelve con su id asignado.
router.post("/", (req, res) => {
  let newProd = req.body;

  productsDaoMongoDB.CreateProd(newProd).then((prod) => {
    res.json(prod);
  });
});

//recibe y actualiza un producto según su id.
router.put("/:id", (req, res) => {
  let { id } = req.params;
  let prod = req.body;

  productsDaoMongoDB.UpdateProd(id, prod).then((prods) => {
    res.json(prods);
  });
});

//elimina un producto según su id.
router.delete("/:id", (req, res) => {
  let { id } = req.params;

  productsDaoMongoDB.DeleteProd(id).then((data) => {
    res.json(data);
  });
});

export default router;