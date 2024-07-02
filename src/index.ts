
// @ts-nocheck
import express from 'express'
import bodyParser from 'body-parser'
import googleHandler from './router/google-handler'
import dataReciver from './router/data-reciver'
import testRouter from './router/base-router'
import pdfHandler from './router/pdf-invoice'
import path from 'path';

const app = express()

require("dotenv").config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Define o caminho para o diretório 'public'
const publicDirPath = path.join(__dirname, 'public');

// Configura o middleware para servir arquivos estáticos
app.use(express.static(publicDirPath));
// app.use(express.static(path.join(__dirname, 'public')));


// router
app.use('/', googleHandler)
app.use('/data-reciver', dataReciver)
app.use('/pdf', pdfHandler)

// to test only
app.use('/test', testRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
});