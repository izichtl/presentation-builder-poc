// @ts-nocheck
import axios from 'axios'

export function pdfBuilderAPI(email: string) {
  var config = {
    method: 'get',
    url: `${process.env.APP_REDIRECT_URL}/pdf/botmaker?email=${email}`,
    headers: {
      'Authorization': `Bearer ${process.env.WA_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  console.log('retorna')
  return axios(config)
}

export function updateChat(email: string, id: string, channelId: string, contactId: string) {
  const url = 'https://api.botmaker.com/v2.0/chats-actions/trigger-intent'
  console.log(process.env.BOTMAKER_API_AUTH)
  const data = {
    "chat": {
      "channelId": channelId,
      "contactId": contactId
    },
    "intentIdOrName": "arco-hsr9i10buu@b.m-1720063141260",
    "variables": {
      "presentationId": id,
      "userEmail": email
    },
    "tags": {
      "tagName": true,
      "anotherTag": false
    },
    "webhookPayload": "string"
  }
  const headers = {
    'Access-token': `${process.env.BOTMAKER_API_AUTH}`,
    'Content-Type': 'application/json'
  }
  return axios.post(url, data, { headers })
  .then(response => {
    console.log('Response:', response.data);
    // Handle the response data
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle error
  });
}