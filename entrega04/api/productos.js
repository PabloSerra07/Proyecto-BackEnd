class Productos {
    constructor() {
        this.productos = []
        this.id = 0
    }

    listar(id) {
        let prod = this.productos.find(prod => prod.id == id)
        return prod || {error : 'No se encuentra el producto'}
    }

    listarAll() {
        return this.productos.length? this.productos : {error : 'No hay productos cargados'}
    }

    guardar(prod) {
        prod.id = ++this.id
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

export default Productos