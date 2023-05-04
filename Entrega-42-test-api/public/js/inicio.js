const saveProd = document.getElementById("enviarProd");
saveProd.addEventListener("click", (e) => {
  e.stopPropagation();
  AddProducto();
});

async function DeleteProd(id){
  console.log("DeleteProd ejecutada");
  
  try{
    await fetch(`http://localhost:8080/api/productos/delete/${id}`, {
      method: "DELETE",
    })
    .then(response => response.json())
    .then(() => {
      ViewProds();
    })
  }catch(error){
    console.log(error);
  }
}

async function ViewProds() {
  console.log("ViewProds ejecutada");
  try {
    await fetch("http://localhost:8080/api/productos")
    .then(response => response.json())
    .then(data => {
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
                            <td>
                              <img src="./images/icon-trash.png" clas="" id="_${prod._id}">
                            </td>
                        </tr>`
                    )}
                </table>
            </div>`;

            productos.forEach(prod => {

              let btnDeleteProd = document.getElementById(`_${prod._id}`);
  
              btnDeleteProd.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                DeleteProd(`${prod._id}`);
              });
            })
        
      } else {
        document.getElementById("vistaContainer").innerHTML =
          '<h3 class="alert alert-danger">No se encontraron productos</h3>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  } catch (error) {
    console.log(error);
  }
}

ViewProds();

async function AddProducto() {
  console.log("AddProducto ejecutada");

  const productoN = {
    title: document.getElementById("nombre").value,
    price: document.getElementById("precio").value,
    thumbnail: document.getElementById("URLImagen").value,
    brand: document.getElementById("marca").value,
    stock: document.getElementById("stock").value,
  };

  try {
    await fetch("http://localhost:8080/api/productos/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productoN)
    })
    .then((resp)=>{resp.json()})
    .then(()=>{
      ViewProds();
    })
  } catch (error) {
    console.log(error);
  }
}