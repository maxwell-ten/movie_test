import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import mongoose from 'mongoose'

import streamRouter from './modules/stream/stream.controller'
import contentRouter from './modules/content/content.controller'
import moviesRouter from './modules/movies/movies.controller'


try{

    mongoose.connect('mongodb://127.0.0.1:27017/movie').then(() => {
        console.log('connected')
    })
}catch (error) {
    console.warn('failed', error)
    throw error
}

//middleware
const app = express()
app.use(cors())
app.use(express.json())
app.use(logger('dev'))
// app.set('views', path.join(__dirname, 'views'))

// endpoints
app.use('/stream', streamRouter)
app.use('/content', contentRouter)
app.use('/movies', moviesRouter)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('ffaf')
    console.log(`http://localhost:${PORT}`)
})