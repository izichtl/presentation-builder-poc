// @ts-nocheck
import express, { Request, Response, Router } from 'express'
import multer from 'multer'
import { redisPool } from '../database/redis'
import { formatDateTime } from '../helper/datetime'
import Redis from 'ioredis';

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

router.post('/whatsapp/metrics', upload.none(), async (req: Request, res: Response) => {
  let redisClient = null
  try {
    redisClient = await redisPool.acquire().then(e=>console.log('acquire-post', e)).catch(e=>console.log('acquire-post',e))
    const dataFromForm = req.body
    const userExist = await redisClient.get(dataFromForm.user_id).then(e=>console.log('get-post', e)).catch(e=>console.log('get-post',e))

    if (userExist === null || userExist === undefined) {
      const userModel = {
        id: dataFromForm.user_id,
        data_array: [],
        created_at: formatDateTime(new Date())
      }
      delete dataFromForm.user_id
      userModel.data_array.push(dataFromForm)
      redisClient.set(userModel.id as string, JSON.stringify(userModel)).then(e=>console.log('set-post1', e)).catch(e=>console.log('set-post1',e))
    } else {
      const jsonUserExist = JSON.parse(userExist)
      delete dataFromForm.user_id
      jsonUserExist.data_array.push(dataFromForm)
      redisClient.set(jsonUserExist.id as string, JSON.stringify(jsonUserExist)).then(e=>console.log('set-post', e)).catch(e=>console.log('set-post2',e))
    }
  } catch (error) {
    console.error('Erro ao usar a conexão Redis:', error)
  } finally {
    if (redisClient) {
      await redisPool.release(redisClient).then(e=>console.log('release-post', e)).catch(e=>console.log('release-post',e))
    }
    res.status(200).send({
      success: true
    })
  }
})
router.delete('/whatsapp/metrics', upload.none(), async (req: Request, res: Response) => {
  let redisClient = null
  let response = {
    success: true,
    msg: 'deleted',
    status: 200
  }
  try {
    redisClient = await redisPool.acquire().then(e=>console.log('acquire-del', e)).catch(e=>console.log('acquire-del',e))
    const dataFromForm = req.body
    const userExist = await redisClient.get(dataFromForm.user_id).then(e=>console.log('get-del', e)).catch(e=>console.log('get-del',e))

    if (userExist === null || userExist === undefined) {
      response.success = false
      response.status = 400
      response.msg = 'user_not_found'
    } else {
      redisClient.del(dataFromForm.user_id)
    }
  } catch (error) {
    console.error('Erro ao usar a conexão Redis:', error)
  } finally {
    if (redisClient) {
      await redisPool.release(redisClient).then(e=>console.log('release-del', e)).catch(e=>console.log('release-del',e))
    }
    res.status(response.status).send({
      success: response.success,
      msg: response.msg,
    })
  }
})
router.get('/whatsapp/metrics', upload.none(), async (req: Request, res: Response) => {
  console.log('get - 01')
  let redisClient = null
  let response = {
    success: false,
    data: 'user_not_found',
    status: 400
  }
  const user_id = req.query.user
  console.log('get - 02')
  if (user_id === null || user_id === undefined || user_id === '') {
    console.log('get - 04')
    res.status(401).send({
      success: false,
      data: 'invalid_params',
    })
    return
  }
  console.log('get - 03')
  try {
    redisClient = await redisPool.acquire().then(e=>console.log('acquire-get', e)).catch(e=>console.log('acquire-get', e))
    const userExist = await redisClient.get(user_id).then(e=>console.log('get-get', e)).catch(e=>console.log('get-get', e))
    if (!(userExist === null)) {
      response.success = true
      response.status = 200
      response.data = JSON.parse(userExist)
    } 
  } catch (error) {
      console.error('Erro ao usar a conexão Redis:', error)
  } finally {
    if (redisClient) {
      await redisPool.release(redisClient).then(e=>console.log('release-get', e)).catch(e=>console.log('release-get', e))
    }
    res.status(response.status).send({
      success: response.success,
      data: response.data,
    })
  }
})

export default router

