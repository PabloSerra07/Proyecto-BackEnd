

////// generar un servidor //////

// const http = require('http');

// const server = http.createServer((peticion, respuesta) => {
//     respuesta.end('Hola mundo')
// });

// const connectedServer = server.listen(8080, () => {
//     console.log(`Servidor Http escuchando en el puerto ${connectedServer.address().port}`)
// })


let hora = new Date();
console.log(hora.getHours())
const fecha = new Date()
console.log(fecha.getDate())
//// otra forma de generar un servidor

const express = require(`express`);

const app = express();

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (peticion, respuesta) => {
    respuesta.send({ mensaje: '<h1> Nivel 1 </>' })
});

app.get('/visitas', (peticion, respuesta) => {
    respuesta.send({ mensaje: 'visitas 10' })
});

app.get('/fyh', (peticion, respuesta) => {
    respuesta.send({mensaje: hora.getHours(), mensaje: fecha.getDate() })
});



// let hora = new Date();
// console.log(hora.getHours())