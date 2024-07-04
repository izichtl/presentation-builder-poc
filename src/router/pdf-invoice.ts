import express, { Request, Response, Router } from 'express';
import { buildPDF, buildPDFBotMaker } from '../helper/pdf-builder';
import { getUserFromEmail, getUserFromEmailInSupabase } from '../helper/user';
import { getFile } from '../helper/google-module/drive-api-functions';
import { authLayer } from '../helper/introduction-builder';
import { getFileStream } from '../helper/google-module/drive-api-functions';
const router: Router = express.Router();
router.use(express.json());


router.get('/invoice', async (req: Request, res: Response) => {
  if (req.query.email === undefined) {
    return res.send('Please send user email as query string')
  } else {
    const email: string = req.query.email as string
    const user = await getUserFromEmail(email)
    const jsonUser = JSON.parse(user)
    // const htmlTitle = jsonUser.title;

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline;filename=${jsonUser.title}.pdf`
        
        // to force download on user browser
        // 'Content-Disposition': 'attachment;filename=pdf.pdf'
    })
    buildPDF(
        jsonUser,
        (data: any) => stream.write(data),
        () => stream.end()
    )
  }
})

router.get('/botmaker', async (req: Request, res: Response) => {
  console.log('----------------------------')
  console.log('----------------------------')
  console.log('----------------------------')
  console.log('----------------------------')
  console.log('----------------------------')
  console.log('----------------------------')
  console.log('----------------------------')
  if (req.query.email === undefined) {
    return res.send('Please send user email as query string')
  } else {
    const email: string = req.query.email as string
    const user = await getUserFromEmailInSupabase(email)
    
    await buildPDFBotMaker(user)
    res.status(200).send({
      success: true
    })
  }
})

router.get('/apresentacao', async (req: Request, res: Response) => {
  
  const id = req.query.fileId as string
  const email = req.query.email as string
  
  const token = await authLayer(email)
  const fileInfo = await getFile(token, id)
  
  // Get file name and MIME type
  const fileName = fileInfo.data.name;
  const mimeType = fileInfo.data.mimeType;

  // Set headers for file download
  res.set('Content-Type', mimeType);
  res.set('Content-Disposition', `inline; filename="${fileName}"`)

  // Get file stream from Google Drive
  const fileStream = await getFileStream(token, id)
  fileStream.data.pipe(res)

  })





export default router

// function gunzipToBuffer(gunzipInstance: any) {
//   return new Promise((resolve, reject) => {
//     const chunks: any = [];
    
//     // Evento 'data' para capturar cada pedaço de dados descomprimidos
//     gunzipInstance.on('data', (data: any) => {
//       chunks.push(data); // Adiciona o chunk ao array de chunks
//     });

//     // Evento 'end' para saber quando a descompressão terminou
//     gunzipInstance.on('end', () => {
//       // Concatena todos os chunks em um único Buffer
//       const buffer = Buffer.concat(chunks);
//       resolve(buffer);
//     });

//     // Evento 'error' para lidar com erros de descompressão
//     gunzipInstance.on('error', (err: any) => {
//       reject(err);
//     });
//   });
// }

//     stream.write(await gunzipToBuffer(fileStream.data))