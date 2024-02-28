import mongoose from 'mongoose'

const connect = () =>{
    return mongoose.connect('mongodb+srv://magostina:coder3425@ecommerce.yjygogp.mongodb.net/ecommerce')
    .then(() =>{
        console.log('base de datos conectada')
    }).catch((err) =>{
        console.log(err)
    })
}

const Database = { connect }

export default Database