import {
  normalize,
  schema,
  denormalize,
} from "https://cdn.jsdelivr.net/npm/normalizr@3.6.2/+esm";

let socket = io.connect();

// VISTA DE PRODUCTOS
socket.on("productos", (data) => {
  if (data) {
    document.getElementById("vistaContainer").innerHTML = `
        <div class="table-responsive">
            <table class="table table-dark">
                <tr class="text-white fw-bold"> 
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                </tr>
                ${data.map(
                  (prod) =>
                    `<tr>
                        <td class="align-middle">${prod.id}</td>
                        <td class="align-middle">${prod.title}</td>
                        <td class="align-middle">$${prod.price}</td>
                        <td class="align-middle">
                            <img src=${prod.thumbnail} style="width: 80px">
                        </td>
                    </tr>`
                )}
            </table>
        </div>`;
  } else {
    document.getElementById("vistaContainer").innerHTML =
      '<h3 class="alert alert-danger">No se encontraron productos</h3>';
  }
});

function AddProducto() {
  const productoN = {
    title: document.getElementById("nombre").value,
    price: document.getElementById("Precio").value,
    thumbnail: document.getElementById("URLImagen").value,
  };
  socket.emit("nuevo-producto", productoN);
  return false;
}

document.getElementById("enviarProd").addEventListener("click", (e)=>{
  e.stopPropagation()
  e.preventDefault()
  AddProducto()
})

// CENTRO DE MENSAJES
socket.on("mensajes", (data) => {
  const normalizedData = NormalizedData(data);
  const desnormalizedData = Desnormalize(data);

  let originalLength = JSON.stringify(data).length;
  let normalizedLength = JSON.stringify(normalizedData).length;
  // let desnormalizedLegth = JSON.stringify(desnormalizedData).length;


  let porcentajeCompresion = 100 - (normalizedLength / originalLength) * 100;

  document.getElementById(
    "porcentaje_compresion"
  ).innerHTML = `Porcentaje de compresión: ${porcentajeCompresion.toFixed(2)}%`;

  document.getElementById("contenedorMsj").innerHTML = data
    .map(
      (msj) =>
        `<span class="text-primary"><strong>${msj.author.id}</strong></span>
        <span class="text-danger">[ ${msj.fyh} ]</span>: 
        <span class="text-success fst-italic">${msj.text}</span>
        <span class="text-success fst-italic"><img style="width: 6%" class="ml-2" src="${msj.author.avatar}" alt="${msj.author.name} avatar"></span>`
    )
    .join("<br>");
});

function NormalizedData(data) {
  const messages = { id: "mensajesData", mensajes: data };
  const authorSchema = new schema.Entity("author");
  const normalizedData = normalize(messages, authorSchema);
  return normalizedData;
}

function Desnormalize(data) {
  const messages = { id: "mensajesData", mensajes: data };
  const authorSchema = new schema.Entity("author");
  const normalizedData = normalize(messages, authorSchema);
  const denormalizedBlogpost = denormalize(
    normalizedData.result,
    authorSchema,
    normalizedData.entities
  );
  return denormalizedBlogpost;
}

function AddMensaje() {
  const mensaje = {
    author: {
      id: document.getElementById("enviarEmail").value,
      nombre: document.getElementById("enviarNombre").value,
      apellido: document.getElementById("enviarApellido").value,
      edad: document.getElementById("enviarEdad").value,
      alias: document.getElementById("enviarAlias").value,
      avatar: document.getElementById("enviarAvatar").value,
    },
    fyh: new Date().toLocaleString(),
    text: document.getElementById("enviarMsj").value,
  };
  socket.emit("nuevo-mensaje", mensaje);
  return false;
}

document.getElementById("btnMsj").addEventListener("click", (e)=>{
  e.stopPropagation()
  e.preventDefault()
  AddMensaje()
})