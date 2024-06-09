import axios from 'axios';
import { updateUserToken } from './user';
require("dotenv").config()
export async function obterTokenDeAtualizacao(data: any, email: string): Promise<string> {
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.APP_CLIENT_ID,
            client_secret: process.env.APP_CLIENT_SECRET,
            refresh_token: data.refresh_token,
            grant_type: 'refresh_token'
        })
        const accessToken = response.data.access_token
        await updateUserToken(email, accessToken, undefined)
        return accessToken
    } catch (error) {
        console.error('Erro ao obter token de atualização:', error)
        throw error
    }
}

export async function verifyGoogleToken(token: string): Promise<boolean> {
    const url  = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    try {
      await axios.get(url)
      return true 
    } catch (error) {
      // @ts-ignore
      if (error.response.data.error === 'invalid_token') {
        return false
      }
      return false
    }
}


