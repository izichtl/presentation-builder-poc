
// @ts-nocheck
import express from 'express'
import bodyParser from 'body-parser'
import googleHandler from './src/router/google-handler.ts'
import dataReciver from './src/router/data-reciver.ts'
import testRouter from './src/router/base-router.ts'

const app = express()

require("dotenv").config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// router
app.use('/', googleHandler)
app.use('/data-reciver', dataReciver)

// to test only
app.use('/test', testRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
});