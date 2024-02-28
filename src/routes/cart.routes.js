import {Router} from 'express'
import CartManager from '../db/managers/cartManager.js'
import Product from '../db/models/product.model.js'

const cart = new CartManager()
const routerCart = Router()

routerCart.post('/', async (req, res) => {
    try {
        const { code } = req.body
        const newCart = await cart.createCart({ code })
        res.status(201).json({
            message: 'Carrito creado correctamente.',
            data: newCart
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al crear el carrito'
        })
    }
})

// endpoint para mostrar los productos del carrito desde el navegador
routerCart.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartData = await cart.getCartById(cartId)
        if (!cartData) {
            return res.status(404).json({ message: 'Carrito no encontrado.'});
        }

        const productIds = cartData.products.map(product => product.product);
        // Buscar el detalles de los productos
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        cartData.products = cartData.products.map(product => {
            const productDetail = products.find(p => p._id.toString() === product.product.toString());
            return {
                ...product,
                product: productDetail
            }
        })

        res.render('cart', { cart: cartData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener el carrito.' })
    }
})

routerCart.get('/:cid', async (req, res) => {
    const cartId = req.params.cid

    try {
        const cartData = await cart.getCartById(cartId)
        if (cartData) {
            res.json(cartData)
        } else {
            res.status(404).json({
                message: 'Carrito no encontrado'
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al obtener el carrito'
        })
    }
})


routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid

    try{
        const quantity = req.body.quantity || 1
        await cart.addToCart(cartId, productId, quantity)
        res.status(200).json({
            message: 'Producto agregado al carrito'
        })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message: 'Error al agregar el producto al carrito'
        })
    }
})

//nuevos endpoints
routerCart.delete('/:cid/products/:pid', async (req, res) =>{
    const cartId = req.params.cid
    const productId = req.params.pid

    try{
        const quantity = req.body.quantity || 1
        await cart.deleteProductCart(cartId, productId, quantity)
        res.status(200).json({
            message: 'Producto eliminado del carrito'
        })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message: 'Error al eliminar el producto del carrito'
        })
    }
})

routerCart.delete('/:cid', async (req, res) =>{
    try {
        const {cid} = req.params
        const resp = await cart.deleteFromCart(cid)
        
        res.status(200).json({ 
            send: resp,
            message: `Carrito con ID ${cid} vacío` 
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al eliminar productos del carrito' 
        })
    }
})

routerCart.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const updatedCart = req.body;
        await cart.updateCart(cartId, updatedCart);
        res.json({ 
            message: `Carrito con ID ${cartId} actualizado correctamente` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Error al actualizar el carrito' 
        })
    }
})

routerCart.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await cart.updateQuantity(cartId, productId, quantity)
        res.status(200).json({
            message: 'Cantidad de productos actualizada en el carrito.'
        })
    } catch(error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al actualizar la cantidad de producto en el carrito.'
        })
    }
})

export default routerCart