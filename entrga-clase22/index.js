import express from 'express'
import {faker} from '@faker-js/faker'


// persistencia

let productos_test = [];
let productos = []

// Configuramos el idioma español
faker.locale = 'en'
const app = express()


app.use(express.urlencoded({extended: true})) 

let id = 1
function getNextId(){
    return id++
}


app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/formulario', (req, res) => {
    res.render('form', {productos});
});

app.get('/table', (req, res) => {
    res.render('form1', {productos});
});


app.post('/datos', (req, res) => {
    productos.push(req.body)
    console.log(productos)
    res.redirect('/table')
});

// Vamos a crear una función que nos traiga elementos de forma aleatoria
function crearAlAzar(id) {
    return {
        id,
        nombre: faker.name.firstName(),
        precio: faker.finance.amount(),
        foto: faker.image.avatar()
    }
}

function generarProductos(cant) {
    for(let i = 0; i < cant; i++) {
        productos_test.push(crearAlAzar(getNextId()))
    }
    return productos_test
}
app.get('/api', (req, res) => {
    res.render('form1', {productos_test});
});


// crear variable de entorno
const CANT_PRODUCTOS = 5

app.get('/api/productos_test', (req, res) => {
    const cant = Number(req.query.cant) || CANT_PRODUCTOS
    res.json(generarProductos(cant))
    console.log(generarProductos(cant))
})

// Configuramos nuestro server
const PORT = 8080
const srv = app.listen(PORT, () => {
    console.log('Server ON, in port: ' + PORT)
})
srv.on('error', error => console.log('Error en el servidor: ' + PORT))