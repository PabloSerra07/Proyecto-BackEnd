export function MensajeDTO(mensaje){
    return{
        ...mensaje,
        fyh: new Date().toLocaleString()
    }
}