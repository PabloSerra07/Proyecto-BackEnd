import OrderFactory from "../factory/order_factory.js"

class order_repository{
    constructor () {
        this.ordersDAO = OrderFactory.getDAO();
    }

    async create(idUser, idCart){
        const orderID = await this.ordersDAO.CreateOrder(idUser, idCart);  
        return orderID
    }

    async ListById(idUser){
        const orders = await this.ordersDAO.OrdersById(idUser) 
        return orders
    }

}

export default new order_repository()