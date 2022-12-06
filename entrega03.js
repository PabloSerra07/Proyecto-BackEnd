
const fs = require (`fs`)

const express = require(`express`);

const app = express();

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/productos', (peticion, respuesta) => {
    respuesta.send({ mensaje:  datosArray(`./productos.txt`) })
});

app.get('/productoRandom', (peticion, respuesta) => {
    respuesta.send({ mensaje: getById() })
});

function  datosArray(textName){
    let datos = fs.readFileSync(textName, `utf-8`)
    let datosJson = JSON.parse(datos.toString().trim())
    return datosJson
}

function getById(){
    let id = Math.floor(Math.random()*4)
    let datos = datosArray(`./productos.txt`) 
    console.log(datos)
    let result = datos.find((dato)=>dato.id==id)
    console.log(result)
    return result
    
}




// const datosArray = fs.readFileSync(`./productos.txt`, `utf-8`)


// const cualquierDatoArray = fs.
// async function  datosArray(datos){
//     await fs.readFileSync(`./productos.txt`, `utf-8`)
    
// }

