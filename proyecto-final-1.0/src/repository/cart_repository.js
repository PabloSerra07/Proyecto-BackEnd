import CartFactory from "../factory/cart_factory.js"

class cart_repository{
    constructor () {
        this.cartDAO = CartFactory.getDAO();
    }

    async find(){
        const carts = await this.cartDAO.GetCarts()
        return carts
    }

    async findByID(id){
        const cart = await this.cartDAO.ListById(id)
        return cart
    }

    async create(){
        const newCartID = await this.cartDAO.CreateCart()
        return newCartID
    }

    async assignsCartID(userID){
        const cart = await this.cartDAO.assignsCartID(userID)
        return cart
    }

    async getProds(idCart){
        const prods = await this.cartDAO.GetProds(idCart)
        return prods
    }

    async addProdToCart(idCart, idProd){
        const cart = await this.cartDAO.addProdToCart(idCart, idProd)
        return cart
    }

    async deleteProdfromCart(idCart, idProd){
        const cart = await this.cartDAO.DeleteProd_cart(idCart, idProd)
        return cart
    }

    async deleteCart(cartID, userID){
        const userID_ = await this.cartDAO.DeleteCart(cartID, userID)
        return userID_
    }
}

export default new cart_repository()