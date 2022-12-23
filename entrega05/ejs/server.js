import express from 'express'

// Declarar constantes y arrays
let productos = []

const app = express();

// Funcionalidades de nuestro servidor
app.use(express.urlencoded({extended: true}))

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




/* Configurar el servidor */
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto: ', PORT);
})
server.on('error', error => console.log('Error en el servidor: ', error));