const knexChat = {
    client: 'better-sqlite3',
    useNullAsDefault:true,
    connection: {
        filename: './managers/DB/ecommerce.sqlite'
    }
}
export default knexChat;
