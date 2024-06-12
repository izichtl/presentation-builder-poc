import express, { Request, Response, Router } from 'express';
import { v4 } from 'uuid'
const router: Router = express.Router();
router.use(express.json());
router.get('/', async (req: Request, res: Response) => {
    
    res.send({
        success: true,
        uuid: v4 ()
    })
})

export default router;