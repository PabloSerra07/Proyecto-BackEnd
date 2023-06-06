const userID = document.getElementById("IDcontainer").textContent;

const ordersContainer = document.getElementById("ordersContainer");

export async function OrdersView(idUser) {
  await fetch(`../../orders/${idUser}`)
    .then((res) => res.json())
    .then((data) => {
      const orders = data;

      const title = document.getElementById("OrdersTitle");
      title.innerHTML = `Tus ordenes de compra: ${orders.length}`;

      ordersContainer.innerHTML = `
      <table class="table table-dark" id="tableOrdersContainer">
      </table>
      `;

      const tableOrdersContainer = document.getElementById(
        "tableOrdersContainer"
      );

      if (orders.length > 0) {
        let tableTittle = document.createElement("tr");
        tableTittle.innerHTML = `
              <tr class="text-white fw-bold"> 
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            `;
        tableOrdersContainer.appendChild(tableTittle);

        orders.map((order) => {
          const { _id, timestamp, total } = order;

          let tables = document.createElement("tr");

          tables.innerHTML = `
                    <td class="align-middle">${_id}</td>
                    <td class="align-middle">${timestamp}</td>
                    <td class="align-middle">u$s ${total}</td>
                `;

          tableOrdersContainer.appendChild(tables);
        });
      } else {
        ordersContainer.innerHTML =
          '<h3 class="alert alert-danger">No ha generado ordenes de compra.</h3>';
      }
    });
}

OrdersView(userID);
