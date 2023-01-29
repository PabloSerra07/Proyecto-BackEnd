let socket = io.connect();

socket.on('mensajes', function(msjs) {
    console.log(msjs);
    document.querySelector('p').innerHTML = msjs.map( msj => `SocketId: ${msj.socketid} -> Mensaje: ${msj.mensaje}`).join('<br>')
});

let input = document.querySelector('input')
document.querySelector('button').addEventListener('click', () => {
    socket.emit('mensaje', input.value)
})