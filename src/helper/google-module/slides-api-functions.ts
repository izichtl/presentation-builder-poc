import { google } from 'googleapis';
require("dotenv").config()

const SIZE = {
  UNSPECIFIED: 'THUMBNAIL_SIZE_UNSPECIFIED',
  LARGE: 'LARGE',
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
};

const IMAGE_SIZE = SIZE.LARGE;
const MAX_SLIDE_COUNT = 10;




export async function createPresentation(token: string, title: string) {
    const service: any = google.slides({
      version: 'v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return service.presentations.create({
        title,
    })
  }

  
export async function createSlide(token: string, presentationId: string, requests: string) {
    const service: any = google.slides({
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
  


export async function deletePresentation(token: string, presentationId: string) {
  const service: any = google.drive({
      version: 'v3',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return service.files.update({
      fileId: presentationId,
      requestBody: {
        'trashed': true
      },
    });
}



const getSlideObjects = async (token: string, presentationId: string) => {
  const service: any = google.slides({
    version: 'v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const result = await service.presentations.get({
        presentationId,
        fields: 'slides/objectId',
  })

  const pageObjects = result.data.slides.map(({ objectId }: any) => objectId);
  return pageObjects.slice(0, MAX_SLIDE_COUNT)
};

const getThumbnailUrl = async (token: string, presentationId: string, pageObjectId: string) => {
  const service: any = google.slides({
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

export const getImageLinks = async (token: string, presentationId: string) => {
  const slidesId = await getSlideObjects(token, presentationId)
  const result = []
  for (const slide of slidesId) {
      const theme_page = await getThumbnailUrl(token, presentationId, slide);
      result.push(theme_page)
  }
  return result
};

