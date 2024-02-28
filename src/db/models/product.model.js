import mongoose from 'mongoose'
import mongoPaginate from 'mongoose-paginate-v2'

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        required: true
    }
})

ProductSchema.plugin(mongoPaginate)

const Product = mongoose.model('Product', ProductSchema)
export default Product