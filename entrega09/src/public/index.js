const socket = io();

socket.on("products", (data) => {
    render(data);
  });
  
  socket.on("messages", (data) => {
    renderMessages(data);
  });
  
  function render(data) {
    let html = data
      .map((elem, index) => {
        return `<tr>
      <td>${elem.title}</td>
      <td>${elem.price}</td>
      <td><img src="${elem.thumbnail}" alt="Imagen del producto" style="width: 4rem;"></td>
      </tr>`;
      })
      .join(" ");
    document.getElementById("tbproducts").innerHTML = html;
  }
  
  function renderMessages(data) {
    let html = data
      .map((elem, index) => {
        return `<div>
          <span style="color: blue; font-weight: bold;">${elem.email}</span>
          <span style="color: brown;">[${elem.date}]:</span>
          <span style="color: green; font-style: italic;">${elem.message}</span></div>`;
      })
      .join(" ");
    document.getElementById("messages").innerHTML = html;
  }
  
  function addProduct(e) {
    let producto = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      thumbnail: document.getElementById("thumbnail").value,
    };
    socket.emit("new-product", producto);
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("thumbnail").value = "";
    return false;
  }
  
  function addMessage(e) {
    let message = {
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
      date: formatDate(),
    };
    socket.emit("new-message", message); 
    // new-message es el nombre del evento (recordatorio)
  
    document.getElementById("message").value = "";
    document.getElementById("message").focus();
  
    return false;
  }
  
  const formatDate = () => {
    let date = new Date();
    let formatted_date = `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(
      -2
    )}/${date.getFullYear()} ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`;
    return formatted_date;
  };