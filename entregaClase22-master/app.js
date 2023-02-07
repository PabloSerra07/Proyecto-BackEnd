
import express from 'express';
import fs from 'fs';
import handlebars from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import Contenedor  from './src/controllers/contenedor.js';
import Chat from './src/controllers/chat.js';
import knexChat from './src/controllers/knexChat.js';
import knexProducts from './src/controllers/knexProducts.js';
import  knex  from 'knex';
import products from './src/routes/products.js';




const app = express();


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/', products);
app.use('/', express.static(__dirname+'/public'))
app.use((req, res, next) => {
    console.log(`Time: ${Date.now()}`)
    next()
})

app.use(function (err, req, res, next) {
    console.error( err)
    res.status(500).send("Error !!!")
})


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts')
}));
app.set('view engine', 'handlebars');

// let products = new Contenedor(knexProducts, 'products');
let chat = new Chat(knexChat, 'messages');


const PORT = 8080;
const server = app.listen(PORT, ()=> console.log(`Listening on ${PORT}`));

//
const io = new Server(server);

io.on('connection', async (socket) => {
    console.log('Usuario conectado')

    const arrayProduct = await products.getAll().then((resolve) => resolve);
    const messages = await chat.getMessages().then((res) => res);
  
    console.log(messages)

    socket.emit("products", arrayProduct);
    socket.emit("messages", messages);


    socket.on("new-product", async (data) => {
        await products.save(data).then((resolve) => resolve);
        const arrayProduct = await products
          .getAll()
          .then((resolve) => resolve);
        io.sockets.emit("products", arrayProduct);
      });
    
    socket.on("new-message", async (data) => {
        await chat.saveMessages(data).then((resolve) => resolve);
        const messages = await chat.getMessages().then((resolve) => resolve);
        io.sockets.emit("messages", messages);

    
      });
});

export default app;