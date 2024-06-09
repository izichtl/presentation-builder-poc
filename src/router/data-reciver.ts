// @ts-nocheck
import express, { Request, Response, Router } from 'express'
import multer from 'multer'
import { redisPool } from '../database/redis'

const router: Router = express.Router()
router.use(express.json())
const upload = multer()

router.post('/', upload.none(), async (req: Request, res: Response) => {
        const redisClient = await redisPool.acquire();
        const dataFromForm = req.body;

        const userData = {
          id: dataFromForm.submission_id,
          email: dataFromForm.user_email,
          title: dataFromForm.presetation_title,
          style: dataFromForm.presentation_style,
          thema_list: dataFromForm.presentation_thema_list,
          refresh_token: '',
          access_token: ''
        }

        // console.log(userData)
        const toStore = JSON.stringify(userData)


        // verifica se o user existe no redis
        const userExist = await redisClient.get(userData.email)


        if (userExist === null || userExist === undefined) {
          // salvar o usuário 
          redisClient.set(dataFromForm.user_email, toStore, (err, result) => {
            if (err) {
              console.error('Erro ao definir chave:', err)
            } else {
              // console.log('Valor definido com sucesso:', result)
            }
          })
        } else {
          // user registrado ou autorizado
          const userJSON = JSON.parse(userExist)
          if (userJSON.refresh_token === '') {
            // verifica se o user tem refresh_token
            // salvo user e mando para o oaut
            // preciso enviar ele para oauth
            redisClient.set(dataFromForm.user_email, toStore, (err, result) => {
              if (err) {
                console.error('Erro ao definir chave:', err)
              } else {
                // console.log('Valor definido com sucesso:', result)
              }
            })
          } else {
            // persiste o refresh_token
            // atualiza o dados do usuario
            const refresh_token = userJSON.refresh_token
            userData.refresh_token = refresh_token
            const toStoreUpdate = JSON.stringify(userData)
            redisClient.set(dataFromForm.user_email, toStoreUpdate, (err, result) => {
              if (err) {
                console.error('Erro ao definir chave:', err)
              } else {
                // console.log('Valor definido com sucesso:', result)
              }
            })
          }
        }

        // fecha a conexão com redis
        redisPool.release(redisClient)

        // if (redisClient) {
        //   redisPool.drain().then(() => {
        //       redisPool.clear();
        //   });
        // }
        // res.send(userExist)
        res.redirect('/oauth');
});

export default router;
