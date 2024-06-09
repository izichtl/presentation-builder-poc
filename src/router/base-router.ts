import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();
router.use(express.json());
router.get('/', async (req: Request, res: Response) => {
    res.send({ response: true})
})

export default router;