// @ts-nocheck
import express, { Request, Response, Router } from 'express'
import multer from 'multer'
// import { redisPool } from '../database/redis'
import { supabase } from '../database/supabase'
import { hasAuth } from '../helper/auth'
import { pdfBuilderAPI } from '../api/sender'

const router: Router = express.Router()
router.use(express.json())
const upload = multer()



// router.post('/', upload.none(), async (req: Request, res: Response) => {
//   let email = ''
//   const redisClient = await redisPool.acquire()
//   const dataFromForm = req.body
//   console.log(dataFromForm)

//   if (dataFromForm.gmail_email !== undefined) {
//     email = dataFromForm.gmail_email
//   } else {
//     email = dataFromForm.generic_email
//   }

//   const userData = {
//     id: dataFromForm.submission_id,
//     email: email,
//     title: dataFromForm.presetation_title,
//     style: dataFromForm.presentation_style,
//     thema_list: dataFromForm.presentation_thema_list,
//     refresh_token: '',
//     access_token: ''
//   }

//   const toStore = JSON.stringify(userData)

//   // verifica se o user existe no redis
//   const userExist = await redisClient.get(email)
//   if (userExist === null || userExist === undefined) {
//     redisClient.set(email, toStore)
//   } else {
//     // user registrado ou autorizado
//     const userJSON = JSON.parse(userExist)
//     if (userJSON.refresh_token === '') {
//       // verifica se o user tem refresh_token
//       // salvo user e mando para o oaut
//       // preciso enviar ele para oauth
//       redisClient.set(email, toStore)
//     } else {
//       // persiste o refresh_token
//       // atualiza o dados do usuario
//       const refresh_token = userJSON.refresh_token
//       userData.refresh_token = refresh_token
//       const toStoreUpdate = JSON.stringify(userData)
//       redisClient.set(email, toStoreUpdate)
//     }
//   }

//   // fecha a conexão com redis
//   redisPool.release(redisClient)
//   // res.sendStatus(200)
//   if (dataFromForm.gmail_email !== undefined) {
//     res.redirect('/oauth')
//   } else {
//     res.redirect(`/pdf/invoice?email=${email}`)
//   }
// })

router.post('/wait', upload.none(), async (req: Request, res: Response) => {
  const dataFromBotMaker = req.body
  console.log(dataFromBotMaker)
  console.log(req.headers.authorization)


    const auth = hasAuth(req.headers.authorization)

  console.log(auth)
  if(auth) {
    res.status(401).send({
      success: false,
      data: 'invalid_token'
    })
    
  } else {  
    res.status(200).send({
      success: true,
      data: '--------------'
    })
  }

})
router.post('/create', upload.none(), async (req: Request, res: Response) => {
  const dataFromBotMaker = req.body
  console.log(req.body)
  const auth = hasAuth(req.headers.authorization)

  if(auth) {
    res.status(401).send({
      success: false,
      data: 'invalid_token'
    })
    
  } else {  
  if (
      dataFromBotMaker.chatId !== undefined &&
      dataFromBotMaker.userNumber !== undefined &&
      dataFromBotMaker.chatData !== undefined 
    ) {
    console.log('passou')

    const {
      userEmail,
      getMood, 
      gettitle, 
      firstTheme, 
      secondTheme, 
      thirdTheme, 
      fourthTheme 
    } = dataFromBotMaker.chatData

    const pData = {
      theme: [firstTheme, secondTheme, thirdTheme, fourthTheme],
      mood: getMood,
      title: gettitle
    }
    const insert = await supabase
      .from('whatsapp_presentation')
      .insert(
        {
          "chatId": dataFromBotMaker.chatId,
          "userNumber": dataFromBotMaker.userNumber,
          "channelId": dataFromBotMaker.channelId,
          "userEmail": userEmail,
          "presentationData": pData,
          "presentationDataText": JSON.stringify(pData)
        }
      )

    if (insert.error) {
      console.log('INSERT - Error in supabase');
    }

    pdfBuilderAPI(userEmail)
    
    console.log('retorna')
    res.status(200).send({
      success: true
    })

  } else {
    res.status(401).send({
      success: false,
      data: 'invalid_params'
    })
  }
  }
})

router.delete('/whatsapp/metrics', upload.none(), async (req: Request, res: Response) => {
  const user_id = req.query.user
  if (user_id !== undefined || user_id !== null ) {

    const select = await supabase
      .from('whatsapp_metrics')
      .delete().eq('user_id', user_id)

    if (select.status === 204) {
      res.status(200).send({
        success: true,
        data: 'deleted',
      })
    }
    if (select.error) {
      res.status(500).send({
        success: false,
        data: 'database_error',
      })
    }
  } else {
    res.status(401).send({
      success: false,
      data: 'invalid_params',
    })
  }
})

router.get('/create', upload.none(), async (req: Request, res: Response) => {
  const userEmail = req.query.user

  if (userEmail !== undefined || userEmail !== null ) {
    const select = await supabase
      .from('whatsapp_presentation')
      .select().eq('userEmail', userEmail)
      .order('created_at', { ascending: false });

    if (select.data[0] === undefined) {

      res.status(404).send({
        success: false,
        data: 'user_not_found',
      })

    } else {
      // validar data has client
      res.status(200).send({
        success: true,
        data: select.data[0],
      })

    }
  } else {
    res.status(401).send({
      success: false,
      data: 'invalid_params',
    })
  }
})

export default router

