import express from "express";
import dotenv from "dotenv";
import index from "./routers/index.js";
import bp from "body-parser";

const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(express.static(`/public`))

app.use('/api', index)

const PORT = dotenv.PORT || 8080

// Server.listen(PORT, () => { console.log(`Server on, in port : ${PORT}`)  });


const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
