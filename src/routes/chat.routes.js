import express from 'express'
import {Router} from 'express'

const router = new Router

router.get('/', (req, res) => {
    res.render('chat', {})
})

export default router

