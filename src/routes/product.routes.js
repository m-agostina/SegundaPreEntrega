import {Router} from 'express'
import ProductManager from '../db/managers/productManager.js'
import Product from '../db/models/product.model.js'

const products = new ProductManager()
const routerPr = new Router()

routerPr.post('/', async (req, res) => {
    try {
        await products.addProduct(req.body)

        res.status(201).json({
            message: 'Producto agregado correctamente.' ,
            data: req.body
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            message: 'Error al agregar el producto.' 
        })
    }
})

// Endpoint nuevo
routerPr.get('/products', async (req, res) => {
    try {
        const productsData = await products.getProducts()
  
        await res.render('products', { products: productsData })
        console.log('productos cargados')
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Error al obtener los productos.' 
        })
    }
})


routerPr.get('/', async (req, res) => {
    try{
        const { limit = 10, page = 1, sort, query } = req.query
        
        // paginate
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: parseInt(sort) } : null
        }

        // Filtro para query
        const filter = {}
        if (query) {
            filter.$or = [
                { category: query },
                { availability: query }
            ]
        }

        const products = await Product.paginate(filter, options)
        const response = {
            status: products.docs.length > 0 ? "success" : "error",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage || null,
            nextPage: products.nextPage || null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${products.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}&query=${query || ''}` : null,
            nextLink: products.hasNextPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${products.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}&query=${query || ''}` : null                                                                                                           
        }

        res.json(response)
    }catch(error) {
        console.error(error)
        res.status(500).json({ 
            message: 'Error al obtener los productos' 
        })
    }
})

routerPr.get('/:pid', async (req, res) => {
    const productId = req.params.pid
   
    try {
        const product = await products.getProductById(req.params.pid)
        res.type('json').send(JSON.stringify(product, null, 2))
    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            message: 'Error al obtener el producto' 
        })
    }
})

routerPr.put('/:pid', async (req, res) => {
    const productId = req.params.pid

    try {
        const updatedProduct = req.body
        await products.updateProduct(productId, updatedProduct)
        res.json({ 
            message: `Producto con ID ${productId} actualizado correctamente` 
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            message: 'Error al actualizar el producto' 
        })
    }
})

routerPr.delete('/:pid', async (req, res) => {
    try {
        const {pid} = req.params
        const resp = await products.deleteProduct(pid)
        
        res.status(200).json({ 
            send: resp,
            message: `Producto con ID ${pid} eliminado correctamente` 
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al eliminar el producto' 
        })
    }
})


export default routerPr