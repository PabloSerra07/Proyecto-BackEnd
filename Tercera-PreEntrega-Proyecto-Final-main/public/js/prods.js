import { CartView } from "./carts.js";

const ProdContainer = document.getElementById("ProdContainer");

async function GetProds() {
  try {
    //devuelve todos los productos
    await fetch("../../api/products")
      .then((response) => response.json())
      .then((data) => {
        const prods = data;

        async function AddToCart(prodID) {
          const cartUserID = document.getElementById("IDcartUser").textContent;
          if (cartUserID) {
            try {
              await fetch(`../../api/cart/${cartUserID}/products/${prodID}`, {
                method: "POST",
              })
                .then((response) => response.json())
                .then((cart) => {
                  console.log(
                    `El producto ha sido agregado exitosamente al carrito`
                  );
                  CartView();
                })
                .catch((error) => {
                  console.log(error);
                });
            } catch (error) {
              console.log(
                `Error al agregar el producto: ${prodID} al carrito: ${cartUserID} (fetch): ${error}`
              );
            }
          } else {
            console.log(`NO SE RECIBE EL CARTUSERID: ${cartUserID}`);
          }
        }

        prods.forEach((prods) => {
          let cards = document.createElement("div");
          cards.setAttribute(
            "class",
            "card d-flex row justify-content-between mx-2 mb-4"
          );
          cards.setAttribute("style", "width: 15rem;");

          cards.innerHTML = `
                    <img class="card-img-top" src=${prods.thumbnail} alt=${prods.brand} ${prods.title}>
                    <div class="card-body text-center">
                        <h5 class="card-title text-uppercase">${prods.brand}</h5>
                        <h5 class="card-title">${prods.title}</h5>
                        <p class="card-text">Precio: u$s ${prods.price}</p>
                        <button class="btn btn-primary" id="${prods._id}">AGREGAR A CARRITO</button>
                    </div>
                `;
          ProdContainer.appendChild(cards);

          let btnAddToCart = document.getElementById(`${prods._id}`);

          btnAddToCart.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            AddToCart(`${prods._id}`);
          });
        });
      });
  } catch (error) {
    console.log(`Error en la llamada de productos (fetch): ${error}`);
    return error;
  }
}

GetProds();
