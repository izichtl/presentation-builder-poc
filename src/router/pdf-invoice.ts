import express, { Request, Response, Router } from 'express';
import { buildPDF } from '../helper/pdf-builder';
import { getUserFromEmail } from '../helper/user';
const router: Router = express.Router();
router.use(express.json());


router.get('/invoice', async (req: Request, res: Response) => {
  if (req.query.email === undefined) {
    return res.send('Please send user email as query string')
  } else {
    const email: string = req.query.email as string
    const user = await getUserFromEmail(email)
    const jsonUser = JSON.parse(user)
    const htmlTitle = jsonUser.title;

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

export default router