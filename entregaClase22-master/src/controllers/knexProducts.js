//import dotenv from ('dotenv').config()

const knex = {
    client: 'mysql2',
    
    useNullAsDefault: true,

    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'listadeproductos'
    
    }
}
export default knex
