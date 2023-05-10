import { fork } from "child_process";
import  {logger}  from "../config/winston_config.js"
import { Router } from "express";
import compression from "compression";
import minimist from "minimist";
import os from "os";
import path from "path";

const args = minimist(process.argv.slice(2), []);
const numCPUs = os.cpus().length;

const gzipMiddleware = compression();

const router = Router();

function FakeProds() {
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

//MOCK - FAKE PRODS
router.get("/productos-test", (req, res) => {
    logger.info(
      `Se ha recibido una petición ${req.method} en la ruta ${req.originalUrl}`
    );
  
    const productosFake = FakeProds();
    res.render("productos-test", { productosFake });
});

//INFO UTILIZANDO EL OBJETO PROCESS
router.get("/info", gzipMiddleware, (req, res) => {
    logger.info(
        `Se ha recibido una petición ${req.method} en la ruta ${req.originalUrl}`
    );

    const info = {
        args: args._[0] || args["port"] || args["p"] || JSON.stringify(args),
        platform: process.platform,
        version: process.version,
        memory: process.memoryUsage().rss,
        path: process.cwd(),
        pid: process.pid,
        folder: path.dirname(new URL(import.meta.url).pathname),
        numCPUs: numCPUs,
    };

    res.render("info", { info });
});

export default router