//=========== MODULOS ===========//
import express from 'express';
// import apiProducts from '../routes/products.js';
import fs from 'fs';
import handlebars from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import Contenedor  from './src/controllers/contenedor.js';
import Chat from './src/controllers/chat.js';
import knexChat from './src/controllers/knexChat.js';
import knexProducts from './src/controllers/knexProducts.js';
import  knex  from 'knex';
import router from './src/routes/products.js'




const dirname = path.resolve(path.dirname(''));
//=========== ROUTERS ===========//
const app = express();


//=========== MIDDLEWARES ===========//
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/', router);
app.use('/',express.static(dirname+'/public'))
app.use((req, res, next) => {
    console.log(`Time: ${Date.now()}`)
    next()
})

app.use(function (err, req, res, next) {
    console.error( err)
    res.status(500).send("Error !!!")
})

//=========== MOTOR DE PLANTILLAS ===========//
app.set('views', path.join(dirname, 'src/views'));
app.engine('hbs', handlebars.engine({
    defaultLayout: 'main.hbs',
    layoutsDir: path.join(app.get('views'), 'layouts')
}));
app.set('view engine', 'hbs');


//=========== VARIABLES ===========//
let products = new Contenedor(knexProducts, 'products');
let chat = new Chat(knexChat, 'messages');

//=========== SERVIDOR ===========//
const PORT = 8080;
const server = app.listen(PORT, ()=> console.log(`Listening on ${PORT}`));

//=========== SOCKET ===========//
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