
import express, { Request, Response, Router } from 'express';
import { whatsAppSenderMessage } from '../helper/whats-sender';
import axios from 'axios'
const router: Router = express.Router();
router.use(express.json());

router.get('/', async (req: Request, res: Response) => {
    res.send({ response: true})
})

router.post('/t', (req, res) => {
  console.log('ttttttttttttttt')
  console.log(req.body)
  
  whatsAppSenderMessage("5521982608223", "Envie o código da aposta", "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")


  res.send({}).status(200).end()
});

router.post('/webhook', (req, res) => {
  const dados = req.body;
  console.log('chegada na primeira request')
  axios.post('https://3140-2804-14d-1685-a1e3-7deb-aafe-859a-406d.ngrok-free.app/t', dados)
    .then(response => {
      // Resposta recebida da outra rota
      console.log(response.data);
      // Você pode retornar uma resposta para o cliente, se desejar
      res.send('Dados enviados com sucesso para a outra rota!');
    })
    .catch(error => {
      // Tratamento de erros, se houver
      console.error('Erro ao enviar os dados para a outra rota:', error);
      // Retorne um status de erro para o cliente, se necessário
      res.status(500).send('Erro ao enviar os dados para a outra rota!');
    });



  // 
    // let msg = ''
    // let betDatas = {}
    // console.log(req)
    // res.redirect('https://3140-2804-14d-1685-a1e3-7deb-aafe-859a-406d.ngrok-free.app/t')
    // if(req.body.entry[0] !== undefined) {
    //   const entry = req.body.entry[0].changes
    //   if(entry[0] !== undefined) {
    //     const menssage = entry[0].value.messages
    //     if(menssage[0] !== undefined) {
    //       msg = menssage[0].text.body
    //     }
    //   }

    // }
    // const payload = req.body; // O corpo da solicitação contém os dados da webhook
    // console.log(payload)


    // // const defaultMSG = `Bem vindo ao Cambista Digital da ValSports: 
    // //   1 - Realizar uma aposta;
    // //   2 - Cancelar;
    // //   `
    // // const goPayment = `Aguarde um momento, enviaremos o qrcode para pagamento`
    // // const recivedmsg = value.messages[0].text.body
    // const recivedmsg = msg
    
    // if (recivedmsg === '1'){
    //   whatsAppSenderMessage("5521982608223", "Envie o código da aposta", "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    //   res.status(200).send('Webhook recebida com sucesso!')
    // } 

    // res.status(200).send('Webhook recebida com sucesso!')
  });


export default router