let socket = io.connect();

socket.on("messages", (msjs) => {
  if(msjs.length > 0){
    document.getElementById("msjContainer").innerHTML = msjs
      .map(
        (msj) =>
          `<span class="text-success fst-italic"><img style="width: 6%" class="ml-2 mb-2" src="${msj.user.image}" alt="${msj.user.username} avatar"></span>
          <span class="text-primary"><strong>${msj.user.username}</strong></span>
          <span class="text-danger">[ ${msj.timestamp} ]</span>: 
          <span class="text-success fst-italic">${msj.text}</span>`
        )
      .join("<br>");
  }else {
    document.getElementById("msjContainer").innerHTML = '<h3 class="alert alert-danger">No hay mensajes que mostrar</h3>';
  }
});

function AddMensaje() {
  const message = document.getElementById("sendMsj").value;
  socket.emit("newMessage", message);
  return false;
};

document.getElementById("btnMsj").addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();
  AddMensaje();
});
