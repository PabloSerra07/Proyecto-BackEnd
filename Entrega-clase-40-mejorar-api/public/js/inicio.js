let socket = io.connect();

async function GetProds() {
  try {
    //devuelve todos los productos
    await fetch("../../api/products")
      .then((response) => response.json())
      .then((data) => {
        const productos = data;
        if (productos) {
          document.getElementById("vistaProdsContainer").innerHTML = `
              <div class="table-responsive">
                  <table class="table table-dark">
                      <tr class="text-white fw-bold"> 
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Imagen</th>
                      </tr>
                      ${productos.map(
                        (prod) =>
                          `<tr>
                              <td class="align-middle">${prod._id}</td>
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
      })
  }catch(error){
    console.log(error);
  }
}

GetProds()

// function AddProducto() {
//   const productoN = {
//     title: document.getElementById("nombre").value,
//     price: document.getElementById("precio").value,
//     thumbnail: document.getElementById("URLImagen").value,
//     brand: document.getElementById("marca").value,
//     stock: document.getElementById("stock").value
//   };

//   //FETCH A RUTA PARA GUARDAR PROD
//   //LUEGO DEL FETCH LLAMAR DEVUELTA A GetProds() PARA ACTUALIZAR VISTA

// }

// document.getElementById("enviarProd").addEventListener("click", (e)=>{
//   e.stopPropagation()
//   e.preventDefault()
//   AddProducto()
// })


// CENTRO DE MENSAJES
socket.on("mensajes", (data) => {
  const msjs = data

  document.getElementById("contenedorMsj").innerHTML = 
  msjs.map(
      (msj) =>
        `<span class="text-primary"><strong>${msj.author.id}</strong></span>
        <span class="text-danger">[ ${msj.fyh} ]</span>: 
        <span class="text-success fst-italic">${msj.text}</span>
        <span class="text-success fst-italic"><img style="width: 6%" class="ml-2" src="${msj.author.avatar}" alt="${msj.author.name} avatar"></span>`
    )
    .join("<br>");
});

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
    text: document.getElementById("enviarMsj").value,
  };
  socket.emit("nuevo-mensaje", mensaje);

  //MODIFICAR PARA QUE ACA HAGA FETCH A RUTA QUE GUARDE MENSAJE Y RETORNE EL MENSAJE (COMO SE EJECUTA EN SERVER.JS)

  return false;
}

document.getElementById("btnMsj").addEventListener("click", (e)=>{
  e.stopPropagation()
  e.preventDefault()
  AddMensaje()
})