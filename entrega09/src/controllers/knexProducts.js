//import dotenv from ('dotenv').config()

const knexProducts = {
    client: 'mysql',
    
    useNullAsDefault: true,

    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'listadeproductos1',
        port: '8080'
    }
}
export default knexProducts;
