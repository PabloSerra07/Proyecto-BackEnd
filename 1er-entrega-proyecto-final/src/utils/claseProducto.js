import {product} from '../product.js'



class Productos {
    constructor() {
        this.productos = product
    }

    listar(id) {
        let prod = this.productos.find(prod => prod.id == id)
        return prod || {error : 'No se encuentra el producto'}
    }
    listarAll() {
        return this.productos.length? this.productos : {error : 'No hay productos cargados'}
    }

    guardar(prod) {
        console.log(prod,"prod")
        this.productos.push(prod)
    }

    actualizar(prod,id) {
        prod.id = Number(id)
        let index = this.productos.findIndex( prod => prod.id == id)
        this.productos.splice(index,1,prod)
    }

    borrar(id) {
        let index = this.productos.findIndex( prod => prod.id == id)
        return this.productos.splice(index,1)
    }

}
let instance = new Productos(product)
export default instance
