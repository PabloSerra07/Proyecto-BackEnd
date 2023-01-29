import knexLib from 'knex';

//conexion con knex

class Contenedor {
    constructor (config){
    this.knex = knexLib(config)
    }

    

    // TABLA PRODUCTOS
    crearTabla() {
        return this.knex.schema.dropTableIfExists(producto)
            .finally(() => {
                return this.knex.schema.createTable('productos', table => {
                    table.increments('nombre').primary();
                    table.float('precio').notNullable();
                    table.string('url',50).notNullable();
                    table.integer('stock').notNullable();
                })
            })
    }
 // TABLA DE MENSAJES
    
//  crearTabla() {
//     return this.knex.schema.dropTableIfExists(item[1])
//         .finally(() => {
//             return this.knex.schema.createTable('mensajes', table => {
//                 table.increments('msj_id').primary();
//                 table.string('msj_entrante', 50).notNullable();
//                 table.string('msj saliente',50).notNullable();
//             })
//         })}


        

        insertarArticulos(producto) {
            return this.knex('producto').insert(producto)
        }
    
        listarArticulos() {
            return this.knex('producto').select('*');
        }
    
        borrarArticulosPorId(id) {
            return this.knex.from('producto').where('id', id).del()
        }
    
        actualizarArticulosPorId(stock, id) {
            return this.knex.from('producto').where('id', id).update({ stock: stock})
        }
    
        close() {
            this.knex.destroy();
        }
        
    }
    
    export default Contenedor;





   