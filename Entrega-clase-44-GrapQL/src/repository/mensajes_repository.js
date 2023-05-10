import MensajesFactory from "../factory/mensajes_factory.js";
import {MensajeDTO} from "../DTO/mensajes_DTO.js"

class mensajes_repository{
    constructor(){
        this.mensajesDAO = MensajesFactory.getDAO()
    }

    async find(){
        const mensajes = await this.mensajesDAO.ListarMsjs();  
        return mensajes
    }

    async save(msj){
        const msjToAdd = MensajeDTO(msj)
        await this.mensajesDAO.guardarMsj(msjToAdd)
        return msjToAdd
    }

}

export default new mensajes_repository()