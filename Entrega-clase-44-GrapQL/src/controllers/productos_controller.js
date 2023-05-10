import productos_repository from "../repository/productos_repository.js"
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql'

export const typeDefs = buildSchema(`
  type Producto {
    _id: ID!
    title: String
    price: String
    thumbnail: String
    timestamp: String
    code: String
    stock: String
    brand: String
  }

  type Query {
    productos: [Producto]
    producto(id: ID!): Producto
  }

  type Mutation {
    createProducto(title: String, price: String, thumbnail: String, code: String, stock: String, brand: String): Producto
    deleteProducto(id: ID!): Producto
  }
`);

const resolvers = {
  Query: {
    productos: async () => {
      return await productos_repository.find();
    }
  },
  Mutation: {
    createProducto: async (_, args) => {
      const data = { ...args, timestamp: new Date().toLocaleString() };
      const result = await productos_repository.save(data);
      return result;
    },
    deleteProducto: async (_, { id }) => {
      const result = await productos_repository.delete(id);
      return result;
    },
  },
};

export default  resolvers;








export const GetProds_controller = async (req, res) => {
  const productos = await productos_repository.find();
  res.json(productos);
};

export const CreateProd_controller = async (req, res) => {
  try{
    const data = req.body
    const result = await productos_repository.save(data)

    if (result.code === 409) {
      return res.status(409).json(result);
    }

    return res.json(result)
  }catch(err){
    console.log(err);
  }
}

export const DeleteProd_controller = async (req, res) => {
  let {id} = req.params;
  try{
    const result = await productos_repository.delete(id)
    return res.json(result)
  }catch(err){
    console.log(err);
  }
}