import ProductsFactory from "../factory/products_factory.js"
import { productDTO } from "../DTO/product_DTO.js"

class products_repository{
    constructor () {
        this.productsDAO = ProductsFactory.getDAO();
    }

    async find(){
        const products = await this.productsDAO.GetProds();  
        return products
    }

    async findByID(id){
        const product = await this.productsDAO.ProdById(id)
        return product
    }

    async save(data){
        const prodToAdd = productDTO(data)
        const addedProd = await this.productsDAO.CreateProd(prodToAdd)
        return addedProd
    }

    async update(id, data){
        const updatedProd = await this.productsDAO.UpdateProd(id, data)
        return updatedProd
    }

    async delete(id){
        const deletedProd = await this.productsDAO.DeleteProd(id)
        return deletedProd
    }
}

export default new products_repository()