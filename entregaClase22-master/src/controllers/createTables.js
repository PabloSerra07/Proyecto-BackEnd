
import knexProducts from './knexProducts';
import knexChat from './knexChat';


knexProducts.schema.hasTable('products').then(exists => {
    if (!exists) {
        return knex.schema.createTable('products', table => {
            table.increments('id')
            table.string('title')
            table.float('price')
            table.string('thumbnail')
        })
       
    }
    else {
        console.log('La tabla ya existe')
    }
})


knexChat.schema.hasTable('messages').then(exists => {
    if (!exists) {
        return knexChat.schema.createTable('messages', table => {
            table.increments('id')
            table.string('email')
            table.string('message')
            table.date('date')
        });
        
        
    }
    

    else {
        console.log('El mensaje ya existe')
      
    }
    
})
