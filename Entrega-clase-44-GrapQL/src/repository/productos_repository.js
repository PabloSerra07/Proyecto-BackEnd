import ProductosFactory from "../factory/productos_factory.js"
import {productosDTO} from "../DTO/productos_DTO.js"

class productos_repository{
    constructor () {
        this.productosDAO = ProductosFactory.getDAO();
    }

    async find(){
        const productos = await this.productosDAO.GetProds();  
        return productos
    }

    async save(data){
        const prodToAdd = productosDTO(data)
        const addedProd = await this.productosDAO.CreateProd(prodToAdd)
        return addedProd
    }

    async delete(id){
        const deletedProd = await this.productosDAO.DeleteProd(id)
        return deletedProd
    }
}

export default new productos_repository()