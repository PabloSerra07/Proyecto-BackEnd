import MessagesFactory from "../factory/messages_factory.js"
import { messagesDTO } from "../DTO/messages_DTO.js"

class messages_repository{
    constructor () {
        this.messagesDAO = MessagesFactory.getDAO();
    }

    async find(){
        const msjs = await this.messagesDAO.ListMsjs();  
        return msjs
    }

    async findByEmail(id){
        const msjsByEmail = await this.messagesDAO.ListByEmail(id)
        return msjsByEmail
    }

    async save(msj, user){
        const msjToAdd = messagesDTO(msj, user)
        const msjs = await this.messagesDAO.Save(msjToAdd)
        return msjs
    }
}

export default new messages_repository()