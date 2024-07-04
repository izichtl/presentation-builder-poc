// @ts-nocheck 
import { obterTokenDeAtualizacao, verifyGoogleToken } from "./refresh-token"
import { cmToPoints } from "./unit-converts";
import { getUserFromEmail } from "./user"
import { v4 as uuidv4 } from 'uuid';
import { pushImageInRequest, pushTextInRequest } from './g-slides-elements';
import { createPresentation, createSlide, deletePresentation, getImageLinks } from "./google-module/slides-api-functions";

require("dotenv").config()

export const createIntroduction =  async (email: string, data: any): Promise<string> => {
  
    const imageSlide_Background = 'https://lh3.googleusercontent.com/d/1VF5pK-LZ8r9WJGrqPGT0MTtPxirxvS8u'
    const imageSlide_Crescer = 'https://lh3.googleusercontent.com/d/184BJy5NdcN0G2c31oqJkLE6tEkgemBjY'
    const imageSlide_Sicred = 'https://lh3.googleusercontent.com/d/18I_-9odeS9u95BojYLx-di-khJni73MM'
  
    const larguratotal = (25.4)
    // const alturatotal = (14.29)  
  
    let user_token = ''
    const user_email = email  
    // const user_name = name  
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
      // @ts-ignore
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
      `Briefing - ${data.mood}`,
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
      `${data.name} -2024`,
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
  
    const presentation = await createPresentation(user_token, 'temp')
    console.log('CREATED')
    
    const created_presentation_id = presentation.data.presentationId
    await createSlide(user_token, created_presentation_id, updateWithSubinfo)
    console.log('UPDATED')

    const coopThumbNailsArray = await getImageLinks(user_token, created_presentation_id)

    console.log(coopThumbNailsArray)
    await deletePresentation(user_token, created_presentation_id)

    console.log('DELETED')
    return coopThumbNailsArray[0]
  }

export const authLayer =  async (email: string): Promise<string> => {
    let user_token = ''
    const user_email = email  
    const user = await getUserFromEmail(user_email)
    const jsonUser = JSON.parse(user)
    console.log(jsonUser)
    user_token = jsonUser.access_token
  
  
    const isValid = await verifyGoogleToken(jsonUser.access_token)
    if(!isValid) {
      const ntoken = await obterTokenDeAtualizacao(jsonUser, user_email)
      user_token = ntoken
    }
    return user_token
  }