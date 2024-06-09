
import express, { Request, Response, Router } from 'express';
import { whatsAppSenderMessage } from '../helper/whats-sender';
const router: Router = express.Router();
router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
    res.send({ response: true})
})

router.post('/t', (req, res) => {
  console.log('t')
  console.log(req)

  res.send({}).status(200).end()
});

router.post('/webhook', (req, res) => {
    let msg = ''
    let betDatas = {}
    console.log(req)
    res.redirect('https://3140-2804-14d-1685-a1e3-7deb-aafe-859a-406d.ngrok-free.app/t')
    if(req.body.entry[0] !== undefined) {
      const entry = req.body.entry[0].changes
      if(entry[0] !== undefined) {
        const menssage = entry[0].value.messages
        if(menssage[0] !== undefined) {
          msg = menssage[0].text.body
        }
      }

    }
    const payload = req.body; // O corpo da solicitação contém os dados da webhook
    console.log(payload)


    // const defaultMSG = `Bem vindo ao Cambista Digital da ValSports: 
    //   1 - Realizar uma aposta;
    //   2 - Cancelar;
    //   `
    // const goPayment = `Aguarde um momento, enviaremos o qrcode para pagamento`
    // const recivedmsg = value.messages[0].text.body
    const recivedmsg = msg
    
    if (recivedmsg === '1'){
      whatsAppSenderMessage("5521982608223", "Envie o código da aposta", "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
      res.status(200).send('Webhook recebida com sucesso!')
    } 

    res.status(200).send('Webhook recebida com sucesso!')
  });


export default router