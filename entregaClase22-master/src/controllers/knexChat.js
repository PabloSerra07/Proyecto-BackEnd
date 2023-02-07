const knex = {
    client: 'better-sqlite3',
    useNullAsDefault:true,
    connection: {
        filename: './managers/DB/ecommerce.sqlite'
    }
}
export default knex;
