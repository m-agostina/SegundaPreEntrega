import Product from '../models/product.model.js'

class ProductManager {
    async addProduct(product){
        product.status = true

        try {
            await Product.create(product)
            return 'Producto creado correctamente.'
        } catch (err) {
            return 'Error al crear el producto: ' + err
        }
    }

    async getProducts() {
        try {
            const data = await Product.find().lean()
            return data
        } catch (err) {
            console.log('Error al cargar productos')
            return []
        }
    }

    async getProductById(id) {
        try {
            const data = await Product.findById(id)
            return data
        } catch (err) {
            console.error('No se encontró el producto.', err)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            await Product.updateOne({_id:id}, updatedProduct)
            console.log(`Producto con ID ${id} actualizado correctamente.`)
        } catch (err) {
            console.error('Error al actualizar producto.')
        }
    }

    async deleteProduct(id) {
        try {
            await Product.deleteOne({_id:id})
            console.log(`Producto con ID ${id} eliminado correctamente`)
        } catch (err) {
            console.error('Error al eliminar producto: ', err)
        }
    }
}

export default ProductManager