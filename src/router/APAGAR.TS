/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const creatQRCODE = require('./qrcode');
const path = require('path')
const app = express()
const serverless = require('serverless-http')
const bodyParser = require('body-parser');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
// const {getChrome} = require('./chrome-script')
const waiDD = '107368482457800'
const watk = 'EAAN5Okefd1cBOws46A3GjDXSptQM2LduXX0ZAIWMPZA6swnZBZAVYYZCaNEhKWg5NXprCO5BvEazued6e91b5ZBpRCRsUh3KNRkZArODckZC0f5ShJwsE91ApSBGZA7Wqwjm0FzYmZCAIIe6dtNOx2WQVRZB0G9MeZBkbb9GoseOfv28fHNvlRFCxQC3ucr9CvCVdU4gqzOaJBzIiU5fp2dK6bwZD'
const localURL = 'http://localhost:3000'

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${watk}`
        // 'Authorization': `Bearer ${process.env.WA_TOKEN}`
    }
}

// function toTitleCase(str) {
//     return str.replace(
//       /\w\S*/g,
//       function(txt) {
//         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//       }
//     );
// }
// import { sendMessage } from './functions';

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function (req, res) {
  res.send('Esta é uma rota de teste!1');
  // res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Rota GET para retornar um texto de teste
app.get('/teste', (req, res) => {
    res.send('Esta é uma rota de teste!');
});

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  let msg = ''
  let betDatas = {}
  if(req.body.entry[0] !== undefined) {
    const entry = req.body.entry[0].changes
    if(entry[0] !== undefined) {
      const menssage = entry[0].value.messages
      if(menssage[0] !== undefined) {
        msg = menssage[0].text.body
      }
    }
    // console.log(entry, 'e')
    // if (entry[0] !== undefined) {
    //   const recivedMsg = entry[0].value.messages
    //   if (recivedMsg[0] !== undefined) {
    //     msg = recivedMsg[0].text.body
    //   }
    // }
  }
  // const payload = req.body; // O corpo da solicitação contém os dados da webhook
  // const { value } = req.body.entry[0].changes[0]
  // const t1 = req.body.entry[0]
  // console.log(t1)
  // const { id, from: destination } = value?.messages[0]
  // console.log(payload)
  // console.log(value)
  const defaultMSG = `Bem vindo ao Cambista Digital da ValSports: 
    1 - Realizar uma aposta;
    2 - Cancelar;
    `
  const goPayment = `Aguarde um momento, enviaremos o qrcode para pagamento`
  // const recivedmsg = value.messages[0].text.body
  const recivedmsg = msg
  
  if (recivedmsg === '1'){
    sendMessage("5521982608223", "Envie o código da aposta", "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    res.status(200).send('Webhook recebida com sucesso!');

  }
  if (recivedmsg === '2'){
    sendMessage("5521982608223", "Obrigado por usar o Cambista Digital", "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    res.status(200).send('Webhook recebida com sucesso!');

  } 
  if (!isNumeric(recivedmsg)) {
    sendMessage("5521982608223", defaultMSG, "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    res.status(200).send('Webhook recebida com sucesso!');

  }
  if (recivedmsg === '3') {
    goToPayment(goPayment, betDatas)
    // sendMessage("5521982608223", defaultMSG, "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    res.status(200).send('Webhook recebida com sucesso!');

  }
  if (recivedmsg !== '1' && recivedmsg !== '2' && isNumeric(recivedmsg)) {
    

    const betDataPromise = new Promise((resolve, reject) => {
      getBetData(recivedmsg)
        .then(result => resolve(result))
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
    
    betDataPromise
      .then(betData => {
        // console.log(betData, 'betData!@@@@@@@@');
        if (betData.success) {
          betDatas = betData
          const response = `Confirme os dados da aposta:
           Apostador: ${betData.apostador}
           Valor: ${betData.valor}

           3 - Confirmar.
           2 - Cancelar.
          `
          sendMessage("5521982608223", response, "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")

        }
        // Faça algo com betData
      })
      .catch(error => {
        // Lidar com erro
      });

    // const betData = getBetData(recivedmsg)
    // .then(r => r)
    // .then(r => r)
    // .catch(error => {
    //   console.error(error);
    //   // res.status(500).send('Erro ao obter os dados da aposta.');
    // });
    // console.log(betData, '@@@@@@@@')
    // // console.log(betData, 'betData!@@@@@@@@')
    // // sendMessage("5521982608223", goPayment, "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    // // const pixData = createPix()
    // // console.log(pixData, '@@@@@@@@')
    res.status(200).send('Webhook recebida com sucesso!');

  }


  // console.log(id, destination)
  // Faça o processamento necessário com o payload da webhook
  // ...

  // Responda à solicitação da webhook
  res.status(200).send('Webhook recebida com sucesso!');
});
app.get('/webhook', (req, res) => {
  res.send(req.query["hub.challenge"]).status(200).end()
});


app.get('/uploadIMG', (req, res) => {
  uploadImage()
  res.send('ImagemEnviada').status(200).end()
});


app.get('/createpix', (req, res) => {
  // res.send(req.query["hub.challenge"]).status(200).end()
  // import fetch from 'node-fetch';
  const wooviUrl = 'https://api.openpix.com.br/api/v1/charge?return_existing=true'
  const body = {
    'correlationID': '123',
    'value': 1000,
    'comment': 'my-first-charge'
  }
  const headers = {
    'Authorization': 'Q2xpZW50X0lkXzhkMDBmN2I5LTNkNDctNGVmZC1hMmYxLWRjM2Y5NDhjNGRiYTpDbGllbnRfU2VjcmV0X0RPVW5idjAyRWlucklFWVBmclM3N2VQTytLOVlKUmZGck82VHUxdE1Gb009',
    'content-type': 'application/json'
  }
  const data = {
    key1: 'value1',
    key2: 'value2'
  }
  
  const jsonString = JSON.stringify(body);
 
  axios.post(wooviUrl, jsonString, {headers})
  .then(function (response) {
    const charge = response.data.charge

    console.log(charge.identifier)
    console.log(charge.brCode)
    creatQRCODE(charge.brCode, charge.identifier)
    return true
  }).catch(function (error) {      console.log(error);    });

});


app.use('/static', express.static(path.join(__dirname, 'build')))
module.exports.handler = serverless(app)




const sendMessage = async (number, message, wmaid) => {
  if (wmaid) {
      axios.post(`https://graph.facebook.com/v14.0/${waiDD}/messages`, {
          messaging_product: 'whatsapp',
          context: {
              message_id: wmaid
          },
          to: number,
          type: "text",
          text: { 
              "body": message, 
          }
      }, axiosConfig)

      .then(function (response) {
          return true
      })
      .catch(function (error) {
          console.log(error);
      });
  } else {
      axios.post(`https://graph.facebook.com/v14.0/${waiDD}/messages`, {
          messaging_product: 'whatsapp',
          to: number,
          type: "text",
          text: { 
              "body": message, 
          }
      }, axiosConfig)

      .then(function (response) {
          return true
      })
      .catch(function (error) {
          console.log(error);
      });
  }
}

const getBetData = async (number, message, wmaid) => {
  const payload = {
      number_bet: "374712",
      resultado: "374712"
    }
    const data = await axios.get(`${localURL}/dados/aposta/${number}`, payload, {})
    .then(function (response) {
      // console.log(response)
      return response
    })
    .catch(function (error) {
        console.log(error);
    });
  return data.data
}

const uploadImage = async (number, message, wmaid) => {
  const url = `https://graph.facebook.com/v17.0/${waiDD}/media`;
  const filePath = path.join(__dirname, '/b39f39192ab144e8998b151743cae4d6.png');
  // const filePath = '/b39f39192ab144e8998b151743cae4d6.png';
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('type', 'image/jpeg');
  formData.append('messaging_product', 'whatsapp');

  axios.post(url, formData, {
    headers: {
      'Authorization': `Bearer ${watk}`,
      ...formData.getHeaders()
    }
  })
  .then(function (response) {
    console.log('Media uploaded successfully:', response.data);
    return true
  })
  .catch(function (error) {
      console.error('Error uploading media:', error);

  });
  
}

function isNumeric(str) {
  return /^\d+$/.test(str);
}

const goToPayment = async (goPayment, betData) => {
  await sendMessage("5521982608223", goPayment, "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
  createPix(betData).then(r => {
    // console.log(r)
    sendMessage("5521982608223", r.brcode, "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=")
    return r
  }).catch(e=>e)
  // console.log(pixData, '@@@@@@@@')
}
const createPix = async (betData) => {
    console.log('-----------')
    console.log('-----------')
    console.log('-----------')
    console.log('-----------')
    console.log('-----------')
    console.log('-----------')
    console.log('-----------')
    console.log('-----------')
    console.log(betData, '@@@@@@@@@@@@@@@@@@@@@@')
    let identificado = ''
    let brcode = ''
    const wooviUrl = 'https://api.openpix.com.br/api/v1/charge?return_existing=true'

    const body = {
      'correlationID': '123',
      'value': 1000,
      'comment': 'my-first-charge'
    }
    const headers = {
      'Authorization': 'Q2xpZW50X0lkXzhkMDBmN2I5LTNkNDctNGVmZC1hMmYxLWRjM2Y5NDhjNGRiYTpDbGllbnRfU2VjcmV0X0RPVW5idjAyRWlucklFWVBmclM3N2VQTytLOVlKUmZGck82VHUxdE1Gb009',
      'content-type': 'application/json'
    }
    
    const jsonString = JSON.stringify(body);

    const getPixCode = await axios.post(wooviUrl, jsonString, {headers})
    .then(function (response) {
      const charge = response.data.charge
      identificado = charge.identifier
      brcode = charge.brCode
      creatQRCODE(charge.brCode, charge.identifier)
      return {a: charge.brCode, b:charge.identifier}
    }).catch(function (error) {
      console.log(error);
    });
    console.log(getPixCode, 'getPixCode')
    return {
      identificador: `${identificado}.png`,
      brcode: brcode
  }
}
