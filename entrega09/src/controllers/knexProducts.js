//import dotenv from ('dotenv').config()

const knexProducts = {
    client: "mysql",
    connection: {
    host: "127.0.0.1",
    user: "root",
    port: 3306,
    password: "",
    database: "listaDeProductos",
    },
};
export default knexProducts;
