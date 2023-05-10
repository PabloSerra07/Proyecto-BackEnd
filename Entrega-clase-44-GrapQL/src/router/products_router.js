import { GetProds_controller, CreateProd_controller, DeleteProd_controller } from "../controllers/productos_controller.js"
import {Router} from "express";
import  resolvers  from "../controllers/productos_controller.js";
import  typeDefs  from "../controllers/productos_controller.js";
const router = Router();

router.get("/", GetProds_controller)

router.post("/save", CreateProd_controller)

router.delete("/delete/:id", DeleteProd_controller)




const productosql = Router();

import { graphqlHTTP } from "express-graphql";

productosql.use("/", graphqlHTTP({
    schema: typeDefs,
    rootValue: {
        resolvers,
    },
    graphiql: true,
}));

export { productosql };
export default  router