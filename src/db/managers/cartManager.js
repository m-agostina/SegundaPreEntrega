import Cart from '../models/cart.model.js'

class CartManager{
    async getCartById(cartId) {
        try {
            const cartData = await Cart.findById(cartId).lean()
            return cartData
        } catch (err) {
            console.error('Error al cargar el carrito', err)
            throw err
        }
    }
        
    async createCart(cart) {
        try {
            const newCart = await Cart.create(cart)
            
            return newCart
        } catch (err) {
            console.error('Error al crear el carrito')
            throw err
        }
    }

    async addToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId)
            if(!cart) {
                throw new Error('Carrito no encontrado')
            }
            //ver si el producto ya existe
            const productIndex = cart.products.findIndex(p => p.product === productId)
            
            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity })
            } else {
                // si el producto ya existe, sumar a la cantidad
                cart.products[productIndex].quantity += quantity
            }

            await cart.save()
        } catch (err) {
            console.error('Error al agregar el producto al carrito', err)
            throw err
        }
    }

    async deleteProductCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId)
            if(!cart) {
                throw new Error('Carrito no encontrado.')
            }

            cart.products = cart.products.filter(product => product.product.toString() !== productId)
            await cart.save()

            return 'Producto eliminado del carrito'
        } catch (err) {
            console.error('Error al eliminar producto del carrito: ', err)
        }
    }


    async deleteFromCart(cartId) {
        try {
            const cart = await Cart.findById(cartId)
            if (!cart) {
                throw new Error('Carrito no encontrado.')
            }
            cart.products = []
            await cart.save()
            return 'Todos los productos eliminados del carrito'
        } catch (err) {
            console.error('Error al eliminar los productos del carrito: ', err)
        }
    }

    async updateCart(cartId, updatedCart) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.')
            }
            // verificar si cart es null o undefined
            if (updatedCart && updatedCart.products){
                cart.products = updatedCart.products
    
                await cart.save();
                console.log(`Carrito con ID ${cartId} actualizado correctamente.`)
                return cart
            } else {
                throw new Error('Carrito o productos a actualizar son undefined.')
            }
        } catch (err) {
            console.error('Error al actualizar carrito:', err)
            throw err
        }
    }
    

    async updateQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId)
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
            const productIndex = cart.products.findIndex(product => product.product.toString() === productId)
            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito')
            }
            cart.products[productIndex].quantity = quantity

            await cart.save()
        } catch (err) {
            console.error('Error al actualizar cantidad de productos en el carrito: ', err)
            throw err
        }
    }
}    
export default CartManager
