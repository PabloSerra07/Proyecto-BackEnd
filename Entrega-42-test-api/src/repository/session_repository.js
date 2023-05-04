import SessionFactory from "../factory/session_factory.js"
import {userDTO} from "../DTO/user_DTO.js"

class session_repository{
    constructor () {
        this.userDAO = SessionFactory.getDAO();
    }

    async findOne(email){
        const user = await this.userDAO.FindUser(email);  
        return user
    }

    async save(userData){
        const userToAdd = userDTO(userData)
        await this.userDAO.SaveUser(userToAdd)
        return userToAdd
    }

}

export default new session_repository()