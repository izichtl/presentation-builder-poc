// @ts-nocheck
import express, { Request, Response, Router } from 'express'
import multer from 'multer'
import { redisPool } from '../database/redis'

const router: Router = express.Router()
router.use(express.json())
const upload = multer()

router.post('/', upload.none(), async (req: Request, res: Response) => {
  let email = ''
  const redisClient = await redisPool.acquire()
  const dataFromForm = req.body

  if (dataFromForm.gmail_email !== undefined) {
    email = dataFromForm.gmail_email
  } else {
    email = dataFromForm.generic_email
  }

  const userData = {
    id: dataFromForm.submission_id,
    email: email,
    title: dataFromForm.presetation_title,
    style: dataFromForm.presentation_style,
    thema_list: dataFromForm.presentation_thema_list,
    refresh_token: '',
    access_token: ''
  }

  const toStore = JSON.stringify(userData)

  // verifica se o user existe no redis
  const userExist = await redisClient.get(email)
  if (userExist === null || userExist === undefined) {
    redisClient.set(email, toStore)
  } else {
    // user registrado ou autorizado
    const userJSON = JSON.parse(userExist)
    if (userJSON.refresh_token === '') {
      // verifica se o user tem refresh_token
      // salvo user e mando para o oaut
      // preciso enviar ele para oauth
      redisClient.set(email, toStore)
    } else {
      // persiste o refresh_token
      // atualiza o dados do usuario
      const refresh_token = userJSON.refresh_token
      userData.refresh_token = refresh_token
      const toStoreUpdate = JSON.stringify(userData)
      redisClient.set(email, toStoreUpdate)
    }
  }

  // fecha a conexão com redis
  redisPool.release(redisClient)

  if (dataFromForm.gmail_email !== undefined) {
    res.redirect('/oauth')
  } else {
    res.redirect(`/pdf/invoice?email=${email}`)
  }
})

export default router
