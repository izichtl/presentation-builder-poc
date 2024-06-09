  // @ts-nocheck 
import { v4 as uuidv4 } from 'uuid';
import { introImgUrl, themeImgUrls } from '../storage/image-path';

const processarTemas = (temasString: string): string[] => {
  const temas: { Assuntos: string }[] = JSON.parse(temasString)
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

    processarTemas(data.thema_list).forEach(theme_item => {
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

