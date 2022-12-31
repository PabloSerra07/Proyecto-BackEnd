/* Declarar nuestras constantes */
const handlebars = require ("express-handlebars")
const express = require('express')
const app = express()
// const server = require('http').Server(app)
const socket = require('socket.io')
const path = require('path')

app.use(express.urlencoded({ extended: true }));

let mensajes = []
let productos = []

// llamada a socket ///
app.use(express.static('./views'));






// Establecemos la configuración de handlebars

app.engine(
    "hbs",
    handlebars.engine  ({
        extname: "*.hbs",
        defaultLayout: "index.hbs",
    })
);

app.set('view engine', "hbs");
app.set("views", "./views");

app.get('/formulario', (req, res) => {
        res.render('datos', productos)
    
})

app.get('/datos', (req, res) => {
    console.log(productos.length)
    res.render('datos', {productos});
});



app.post('/datos', (req, res) => {
    const {nombre, precio, url} = req.body
    const producto = {
        'nombre':nombre,
        'precio':precio,
        'url':url
    }
    productos.push(producto)
    console.log(productos)
    res.redirect('/datos')
});


/* Configuración del servidor */

const PORT = 8080
const srv = app.listen(PORT, function()  {
    console.log('Tu servidor esta funcionando en el puerto: ', PORT);
})
srv.on('error', error => console.log('Error en el servidor', error));
const io =  socket(srv)

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.emit('mensajes', mensajes)

    socket.on('mensaje', data => {
        mensajes.push({socketid: socket.id, mensaje: data})
        io.sockets.emit('mensajes', mensajes)
    });
});

