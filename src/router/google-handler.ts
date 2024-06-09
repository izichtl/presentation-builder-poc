// @ts-nocheck 
import express, { Request, Response, Router } from 'express';
import { google } from 'googleapis';
import { getUserFromEmail, getUserFromToken, updateUserToken } from '../helper/user';
import { slidesRequestBuilder } from '../helper/g-slides-builder';
import { obterTokenDeAtualizacao, verifyGoogleToken } from '../helper/refresh-token';
require("dotenv").config()



async function createPresentation(token, title: string) {
  const service = google.slides({
    version: 'v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  service.context
  return service.presentations.create({
      title,
  })
}

async function createSlide(token, presentationId, requests) {
  const service = google.slides({
    version: 'v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return service.presentations.batchUpdate({
    presentationId,
    resource: { requests },
  })
}


const router: Router = express.Router()
router.use(express.json())


const oauth2Client = new google.auth.OAuth2(
  process.env.APP_CLIENT_ID,
  process.env.APP_CLIENT_SECRET,
  process.env.APP_REDIRECT_URL
)

const scopes = [
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/userinfo.email'
]



router.get('/oauth', async (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })

  res.redirect(url)
})
router.get('/', async (req: Request, res: Response) => {
  if (req.query.code === undefined) {
    return res.send('Express Typescript on Vercel')
  } else {
    const code = req.query.code
    const { tokens } = await oauth2Client.getToken(code)
    const user = await getUserFromToken(tokens.id_token)
    const access_token = tokens.access_token
    const user_email = user.payload.email
    const refresh_token = tokens.refresh_token

    await updateUserToken(user_email, access_token, refresh_token)
    res.redirect(307, `/create-presentation?email=${user_email}`)
  }
})

router.get('/create-presentation', async (req: Request, res: Response) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@')
  let user_token = ''
  const user_email = req.query.email  
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log(user_email)
  const user = await getUserFromEmail(user_email)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@1')
  const jsonUser = JSON.parse(user)
  console.log(jsonUser)
  user_token = jsonUser.access_token
  
  const requestObject = await slidesRequestBuilder(jsonUser)

  const isValid = await verifyGoogleToken(jsonUser.access_token)
  if(!isValid) {
    const ntoken = await obterTokenDeAtualizacao(jsonUser, user_email)
    user_token = ntoken
  }

  const presentation = await createPresentation(user_token, requestObject.title)
  const created_presentation_id = presentation.data.presentationId
  await createSlide(user_token, created_presentation_id, requestObject.requests)

  console.log(created_presentation_id)
  




  

  const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`
  
  res.redirect(urlslide)
  // res.send({ response: true})
})

export default router;



