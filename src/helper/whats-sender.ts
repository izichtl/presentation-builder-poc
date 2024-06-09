import axios from 'axios'
require("dotenv").config()

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WA_TOKEN}`
    }
}

export const whatsAppSenderMessage = async (number: any, message:string, wmaid: string) => {
    if (wmaid) {
        axios.post(`https://graph.facebook.com/v14.0/${wmaid}/messages`, {
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
        axios.post(`https://graph.facebook.com/v14.0/${wmaid}/messages`, {
            messaging_product: 'whatsapp',
            to: number,
            type: "text",
            text: { 
                "body": message, 
            }
        }, axiosConfig)
  
        .then(function (response: any) {
            console.log(response)
            return true
        })
        .catch(function (error) {
            console.log(error)
        });
    }
  }