const cartContainer = document.getElementById("CartContainer");
const orderBtn = document.getElementById("newOrder");
const userID = document.getElementById("IDcontainer").textContent;

async function DeleteCart(cartID, userID) {
  try {
    await fetch(`../../api/cart/${cartID}/user/${userID}`, {
      method: "DELETE",
    })
    .then((res) => res.json())
    .catch((error) => console.log(error));
    CartView()
  } catch (error) {
    console.log(`error al ejecutar el fetch para eliminar carrito: ${error}`);
  }
}

async function DeleteProd(idCart, idProd) {
  try {
    await fetch(`../../api/cart/${idCart}/products/${idProd}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((cart) => {
        CartView();
        console.log(`Producto eliminado con exito`);
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(
      `Error al intentar borrar el producto: ${idProd}, del carrito ${idCart}`
    );
  }
}

export async function CartView() {
  try {
    if (userID) {
      //Si el usuario no tiene un ID de carrito asignado, se crea un carrito (EN DB), se le asigna (EN DB) y retorna el carrito, de lo contrario retorna el carrito que tiene asignado.
      await fetch(`../../api/cart/${userID}`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((cart) => {
          const cartID = cart[0]._id;
          const IDcartUser = document.getElementById("IDcartUser");
          IDcartUser.innerHTML = `${cartID}`;
          const cartProds = cart[0].products;

          if (cartProds.length > 0) {
            cartContainer.innerHTML = `
          <table class="table table-dark" id="tableCartContainer">
          </table>
          `;

            const tableCartContainer =
              document.getElementById("tableCartContainer");

            tableCartContainer.innerHTML = "";
            let tableTittle = document.createElement("tr");
            tableTittle.innerHTML = `
              <tr class="text-white fw-bold"> 
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
              </tr>
            `;
            tableCartContainer.appendChild(tableTittle);

            cartProds.forEach((prod) => {
              let tables = document.createElement("tr");

              tables.innerHTML = `
                  <td class="align-middle">${prod._id}</td>
                  <td class="align-middle">${prod.title}</td>
                  <td class="align-middle">$${prod.price}</td>
                  <td class="align-middle">
                      <img src=${prod.thumbnail} style="width: 80px">
                  </td>
                  <td>
                    <img src="./images/icon-trash.png" clas="" id="_${prod._id}">
                  </td>
              `;

              tableCartContainer.appendChild(tables);

              let btnDeleteProd = document.getElementById(`_${prod._id}`);

              btnDeleteProd.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                DeleteProd(`${cartID}`, `${prod._id}`);
              });
            });

          } else {
            cartContainer.innerHTML =
              '<h3 class="alert alert-danger">No se encontraron productos</h3>';
          }

        });
    } else {
      console.log(`NO SE RECIBE EL USERID: ${userID}`);
    }
  } catch (error) {
    console.log(
      `Error en la llamada de productos del carrito del usuario (fetch): ${error}`
    );
    return error;
  }
}

async function CreateOrder(cartID, userID) {
  try {
    await fetch(`../../api/cart/${cartID}/order/${userID}`, {
      method: "POST",
    })
    .then((res) => res.json())
    .then((data) => {
      const orderID = data;
      console.log(`Orden creada con exito! ID: ${orderID}`);
      alert(`Orden creada con exito! ID: ${orderID}`)
      DeleteCart(cartID, userID);
    });
  } catch (error) {
    console.log(error);
  }
}

orderBtn.addEventListener("click", (e) => {
  const cartID = document.getElementById("IDcartUser").textContent;
  e.preventDefault()
  e.stopPropagation()
  CreateOrder(cartID, userID)
})

CartView();