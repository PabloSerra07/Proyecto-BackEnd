/* Importando las depedencias */
import express from 'express'


/* Instanciar nuestras constantes */
const app = express();

let productos = []

/* Funcionalidades del servidor */
app.set('views', './views');
app.set('view engine', 'pug');
// app.use(express.urlencoded({extended: false}))

app.get('/formulario', (req, res) => {
    res.render('form', req.query);
})

app.get('/', (req, res) => {
    res.render('formulario', {productos});
});

app.post('/datos', (req, res) => {
    productos.push(req.body)
    console.log(productos)
    res.send(productos)
    res.redirect(`/`)
});



/* Configuramos el servidor */
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto: ', PORT);
})
server.on('error', error => console.log('Error en el servidor: ', error));