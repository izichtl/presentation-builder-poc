
// @ts-nocheck
import express from 'express'
import bodyParser from 'body-parser'
import googleHandler from './router/google-handler'
import dataReciver from './router/data-reciver'
import testRouter from './router/base-router'
import pdfHandler from './router/pdf-invoice'
import botMaker from './router/bot-maker'
import path from 'path';
// import fs from 'fs'

const app = express()

require("dotenv").config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Define o caminho para o diretório 'public'
export const publicDirPath = path.join(__dirname, 'public');

// Configura o middleware para servir arquivos estáticos
app.use(express.static(publicDirPath));
// app.use(express.static(path.join(__dirname, 'public')));


// console.log(fs.createReadStream(publicDirPath + '/images/intro_a.png'))
// router
app.use('/', googleHandler)
app.use('/data-reciver', dataReciver)
app.use('/pdf', pdfHandler)
app.use('/botmaker', botMaker)

// to test only
app.use('/test', testRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Servidor rodando na porta ${PORT}`)
});