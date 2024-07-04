import express, { Request, Response, Router } from 'express';
import { updateChat } from '../api/sender';
import { v4 } from 'uuid'
const router: Router = express.Router();
router.use(express.json());
router.get('/', async (req: Request, res: Response) => {
    console.log('@@@')
    console.log(req.body)

    const chat = await updateChat('izichtl@gmail.com', '1QD78kQgJiJMtixVKIlqgTZtZ9-GLBj3w', 'arco-whatsapp-555121651571', '5521982608223')
    console.log(chat)
    res.send({
        success: true,
        uuid: v4 ()
    })
})

export default router;


