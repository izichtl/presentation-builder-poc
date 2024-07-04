import { google } from 'googleapis';
// import fs from 'fs'
// import { publicDirPath } from '../../index';
require("dotenv").config()






export async function uploadPDF(token: string, buffer: any, size: any) {
  console.log('Criando pdf ID:');
  let id = ''
  const service: any = google.drive({
    version: 'v2',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const fileMetadata = {
    title: 'photo.pdf',
  };
  const media = {
    mimeType: 'application/pdf',
    body: buffer
  };
  try {
    const file = await service.files.insert({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    return file.data.id;
  } catch (err) {
    throw err;
  }
}


  export async function deleteFile(token: string, presentationId: string) {
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

  export async function getPublicLink(token: string, fileId: string) {
    const service: any = google.drive({
        version: 'v3',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return service.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
  }

  export async function getFileStream(token: string, fileId: string) {
    const service: any = google.drive({
        version: 'v3',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return service.files.get({
        fileId,
        alt: 'media',
      }, { responseType: 'stream' });
  }

  export async function getFile(token: string, fileId: string) {
    const service: any = google.drive({
        version: 'v3',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return service.files.get({
        fileId: fileId
    });
  }

  export async function patchToPublicFile(token: string, fileId: string) {
    const service: any = google.drive({
        version: 'v3',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return service.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  }

