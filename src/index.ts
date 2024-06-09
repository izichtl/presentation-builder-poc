
// @ts-nocheck
import express from 'express'
import bodyParser from 'body-parser'
import googleHandler from './router/google-handler'
import dataReciver from './router/data-reciver'
import testRouter from './router/base-router'
import pdfHandler from './router/pdf-invoice'
import whatsReciver from './router/whats-reciver'

const app = express()

require("dotenv").config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// router
app.use('/', googleHandler)
app.use('/data-reciver', dataReciver)
app.use('/pdf', pdfHandler)
app.use('/', whatsReciver)

// app.post("/webhook",(req,res)=>{
//   let mode=req.query["hub.mode"];
//   let challange=req.query["hub.challenge"];
//   let token=req.query["hub.verify_token"];
//   console.log('@@@@@@@@@@')

//    if(mode && token){

//        if(mode==="subscribe" && token==='ivan'){
//            res.status(200).send(challange);
//        }else{
//            res.status(403);
//        }

//    }

// });


// to test only
app.use('/test', testRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
});