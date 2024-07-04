// @ts-nocheck 
import express, { Request, Response, Router } from 'express';
import { google } from 'googleapis';
import { getUserFromEmail, getUserFromToken, updateUserToken } from '../helper/user';
import { slidesRequestBuilder } from '../helper/g-slides-builder';
import { obterTokenDeAtualizacao, verifyGoogleToken } from '../helper/refresh-token';
import { v4 as uuidv4 } from 'uuid';
import { pushImageInRequest, pushTextInRequest } from '../helper/g-slides-elements';
import { cmToPoints } from '../helper/unit-converts';
require("dotenv").config()


const SIZE = {
  UNSPECIFIED: 'THUMBNAIL_SIZE_UNSPECIFIED',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
};

const IMAGE_SIZE = SIZE.LARGE;
const MAX_SLIDE_COUNT = 10;






const getSlideObjects = async (token, presentationId) => {
  const service = google.slides({
    version: 'v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const result = await service.presentations.get({
        presentationId,
        fields: 'slides/objectId',
  })

  const pageObjects = result.data.slides.map(({ objectId }) => objectId);
  return pageObjects.slice(0, MAX_SLIDE_COUNT)
};

const getThumbnailUrl = async (token, presentationId, pageObjectId) => {
  const service = google.slides({
    version: 'v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await service.presentations.pages
      .getThumbnail({
        presentationId,
        pageObjectId,
        'thumbnailProperties.mimeType': 'PNG',
        'thumbnailProperties.thumbnailSize': IMAGE_SIZE,
      })
  return data.data.contentUrl
};

const getImageLinks = async (token, presentationId) => {
  const slidesId = await getSlideObjects(token, presentationId)
  const tA = []
  for (const slide of slidesId) {
      const theme_page = await getThumbnailUrl(token, presentationId, slide);
      tA.push(theme_page)
  }
  return tA
};

async function createPresentation(token, title: string) {
  const service = google.slides({
    version: 'v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return service.presentations.create({
      title,
  })
}

// async function getPresentationData(token, presentationId: string) {
//   const service = google.slides({
//     version: 'v1',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   return  service.presentations.get({
//       presentationId: presentationId,
//     });
// }

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
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive'
]



router.get('/oauth', async (req: Request, res: Response) => {
  console.log('oauth')
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })
  console.log(url)
  res.redirect(url)
})
router.get('/', async (req: Request, res: Response) => {
  console.log('/')
  if (req.query.code === undefined) {
    return res.send('Presentation Builder a Jotform/Google Slides/PDFkit integration')
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
  let user_token = ''
  const user_email = req.query.email  
  const user = await getUserFromEmail(user_email)

  const jsonUser = JSON.parse(user)
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

  const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`
  
  res.redirect(urlslide)
})

router.get('/create-presentation/google-slides', async (req: Request, res: Response) => {
  let user_token = ''
  const user_email = req.query.email  
  const user_name = req.query.name  
  const user = await getUserFromEmail(user_email)
  const jsonUser = JSON.parse(user)
  user_token = jsonUser.access_token
  

  const isValid = await verifyGoogleToken(jsonUser.access_token)
  if(!isValid) {
    const ntoken = await obterTokenDeAtualizacao(jsonUser, user_email)
    user_token = ntoken
  }

  const introId = '1EOBoPZHmHq7zhwhgWm-6yfn6OWSOp2hWxtcEnqAfRfs'
  const coopId = '1Gmq76r3UPbgfGXnx8YjKnTtVMo5bTrPDh23jZmnlN7A'


  const introdutionSlidesIds = await getSlideObjects(user_token, introId)
  const introdutionThumbnail = await getThumbnailUrl(user_token, introId, introdutionSlidesIds[0]);

  const requests = [
    {
      deleteObject: {
          objectId: 'p'
      },
    }
  ]
  const introduction_slide_id = uuidv4();
  requests.push({
    createSlide: {
        objectId: introduction_slide_id,
    }
  })
  requests.push({
    updatePageProperties: {
        objectId: introduction_slide_id,
        pageProperties: {
            pageBackgroundFill: {
                stretchedPictureFill: {
                    contentUrl: introdutionThumbnail,
                    size: {
                        height: {
                            magnitude: 407,
                            unit: 'PT'
                        },
                        width: {
                            magnitude: 700,
                            unit: 'PT'
                        }
                    }
                }
            }
        },
        fields: 'pageBackgroundFill'
    }
  })

  const coopThumbNailsArray = await getImageLinks(user_token, coopId)

  coopThumbNailsArray.forEach(thumbnail => {
    const innerIntroduction_slide_id = uuidv4();
    requests.push({
      createSlide: {
          objectId: innerIntroduction_slide_id,
      }
    })
    requests.push({
      updatePageProperties: {
          objectId: innerIntroduction_slide_id,
          pageProperties: {
              pageBackgroundFill: {
                  stretchedPictureFill: {
                      contentUrl: thumbnail,
                      size: {
                          height: {
                              magnitude: 407,
                              unit: 'PT'
                          },
                          width: {
                              magnitude: 700,
                              unit: 'PT'
                          }
                      }
                  }
              }
          },
          fields: 'pageBackgroundFill'
      }
    })
  })

  const presentation = await createPresentation(user_token, user_name)
  const created_presentation_id = presentation.data.presentationId
  await createSlide(user_token, created_presentation_id, requests)

  const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`
  
  res.redirect(urlslide)
})

router.get('/create-presentation/slide-builder', async (req: Request, res: Response) => {
  
  const imageSlide_Background = 'https://lh3.googleusercontent.com/d/1VF5pK-LZ8r9WJGrqPGT0MTtPxirxvS8u'
  const imageSlide_Crescer = 'https://lh3.googleusercontent.com/d/184BJy5NdcN0G2c31oqJkLE6tEkgemBjY'
  const imageSlide_Sicred = 'https://lh3.googleusercontent.com/d/18I_-9odeS9u95BojYLx-di-khJni73MM'

  const larguratotal = (25.4)
  // const alturatotal = (14.29)  

  let user_token = ''
  const user_email = req.query.email  
  const user_name = req.query.name  
  const user = await getUserFromEmail(user_email)
  const jsonUser = JSON.parse(user)
  user_token = jsonUser.access_token


  const isValid = await verifyGoogleToken(jsonUser.access_token)
  if(!isValid) {
    const ntoken = await obterTokenDeAtualizacao(jsonUser, user_email)
    user_token = ntoken
  }
  
  // creating id of objets
  const slide_01_id = uuidv4()
  const title_slide_01_id = uuidv4()
  const subtitle_slide_01_id = uuidv4()
  const subinfo_slide_01_id = uuidv4()

  // delete default slide
  const requests = [
    {
      deleteObject: {
          objectId: 'p'
      },
    }
  ]
  // adding the slide to request
  requests.push({
    createSlide: {
      objectId: slide_01_id
    }
  })

  // adding background
  const updatedWithBackGround = pushImageInRequest(
    'background_wave',
    slide_01_id, 
    imageSlide_Background, 
    cmToPoints(0), 
    cmToPoints(8.85),  
    cmToPoints(larguratotal), 
    cmToPoints(5.14),
    requests
  )

  const updatedWithSicredGround = pushImageInRequest(
    'sicred_logo',
    slide_01_id, 
    imageSlide_Sicred, 
    cmToPoints(17.4), 
    cmToPoints(12),  
    cmToPoints(7.19), 
    cmToPoints(2.12),
    updatedWithBackGround
  )

  const updatedWithCrescerGround = pushImageInRequest(
    'crescer_logo',
    slide_01_id, 
    imageSlide_Crescer, 
    cmToPoints((larguratotal/2) - (10.28/2)), 
    cmToPoints(0.1),  
    cmToPoints(10.28), 
    cmToPoints(3.76),
    updatedWithSicredGround
  )

  const updateWithTitle = pushTextInRequest(
    title_slide_01_id,
    slide_01_id,
    'Briefing - REUNIÃO',
    cmToPoints(((larguratotal/2) - (22/2))),
    cmToPoints(3.5),
    cmToPoints(22),
    cmToPoints(2.30),
    'Exo 2',
    50,
    true,
    false,
    {
      red: 0.6,
      green: 0.6,
      blue: 0.6,
    },
    updatedWithCrescerGround
  )

  const updateWithSubTitle = pushTextInRequest(
    subtitle_slide_01_id,
    slide_01_id,
    'Reconstrução formações do Crescer',
    cmToPoints(((larguratotal/2) - (16.32/2))),
    cmToPoints(6),
    cmToPoints(16.32),
    cmToPoints(1.30),
    'Exo 2',
    27,
    false,
    true,
    {
      red: 0.6,
      green: 0.6,
      blue: 0.6,
    },
    updateWithTitle
  )

  const updateWithSubinfo = pushTextInRequest(
    subinfo_slide_01_id,
    slide_01_id,
    'IVAN ZICHTL -2024',
    cmToPoints(1.91),
    cmToPoints(9),
    cmToPoints(6.51),
    cmToPoints(1),
    'Exo 2',
    16,
    false,
    false,
    {
      red: 0.6,
      green: 0.6,
      blue: 0.6,
    },
    updateWithSubTitle
  )

  const presentation = await createPresentation(user_token, user_name)
  const created_presentation_id = presentation.data.presentationId
  await createSlide(user_token, created_presentation_id, updateWithSubinfo)

  const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`
  res.redirect(urlslide)
  // res.send({ 'url': `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p` })
})

export default router