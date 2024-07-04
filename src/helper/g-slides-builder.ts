  // @ts-nocheck 
import { v4 as uuidv4 } from 'uuid';
import { introImgUrl, themeImgUrls } from '../storage/image-path';
import axios from 'axios'
import { themeUrlIds } from '../storage/botmaker-path';
import { authLayer, createIntroduction } from './introduction-builder';
import { getImageLinks } from './google-module/slides-api-functions';

const fetchImage = async (src) => {
  const image = await axios
      .get(src, {
          responseType: 'arraybuffer'
      })
  return image.data
}

const processarTemas = (temasString: string): string[] => {
  const dobleQuoutes = temasString.replaceAll("'", "\"")
  const temas: string[] = JSON.parse(dobleQuoutes)
  const temasProcessados: string[] = []
  temas.forEach((tema) => {
      const temaFormatado = tema.Assuntos
          .toLowerCase()
          // .replace(/[\s\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9]/g, '_');
      temasProcessados.push(`${temaFormatado}`)
  });

  return temasProcessados
}

export const slidesRequestBuilder = async (data) => {
 
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
                      contentUrl: introImgUrl[data.style],
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

    const temasProcessados = processarTemas(data.thema_list)

    temasProcessados.forEach(theme_item => {
      themeImgUrls[theme_item].forEach(element => {
        const thema_slide_id = uuidv4()
        requests.push({
          createSlide: {
            objectId: thema_slide_id,
          }
        })
        requests.push({
          updatePageProperties: {
            objectId: thema_slide_id,
            pageProperties: {
                pageBackgroundFill: {
                    stretchedPictureFill: {
                        contentUrl: element,
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
    })
    return {
        title: data.title,
        requests,
    }
}

export const pdfSlidesBuilder = async (data: any, document: any, sizes: any) => {
  const introduction = await fetchImage(introImgUrl[data.style]);
  // Adicione a página de introdução
  document.image(introduction, {width: sizes.width, height: sizes.height}).text('Stretch', sizes.width, sizes.height)
  
  const temas = processarTemas(data.thema_list)
  for (const theme_item of temas) {
    const themeImgUrlsForItem = themeImgUrls[theme_item]
    for (const element of themeImgUrlsForItem) {
      const theme_page = await fetchImage(element)
      document.addPage({ size: [sizes.width, sizes.height], margin: 0 })
      document.image(theme_page, {width: sizes.width, height: sizes.height}).text('Stretch', sizes.width, sizes.height);
    }
  }
}





export const pdfPresentationBuilderBySlides = async (data: any, document: any, sizes: any, bt: boolean | undefined) => {
  const processedIds = []
  const token = await authLayer(data.userEmail)
  const introUrl = await createIntroduction(
    data.userEmail, { 
    mood: data.presentationData.mood.toUpperCase(), 
    name: data.presentationData.title.toUpperCase()
  })


  const introduction = await fetchImage(introUrl);
  document.image(introduction, {width: sizes.width, height: sizes.height}).text('Stretch', sizes.width, sizes.height)


  const themes = data.presentationData.theme
  themes.forEach((tema) => {
    if(tema !== 'FINALIZAR'){
      processedIds.push(themeUrlIds[tema.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')])
    } 
  })

  const addThemes = async (innerDocument) => {
    for (const id of processedIds) {
      const thumbNailsArray = await getImageLinks(token, id)
      for (const element of thumbNailsArray) {
        const theme_page = await fetchImage(element)
        innerDocument.addPage({ size: [sizes.width, sizes.height], margin: 0 })
        innerDocument.image(theme_page, {width: sizes.width, height: sizes.height}).text('Stretch', sizes.width, sizes.height);
      }
    } 
    return innerDocument
  }
  const outDocument = await addThemes(document)
  return outDocument
}




