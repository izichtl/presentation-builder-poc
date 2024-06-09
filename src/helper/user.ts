import * as jwt from 'jsonwebtoken'
import { redisPool } from '../database/redis';

export async function getUserFromToken(
    token: string
  ): Promise<any> {
    return jwt.decode(token.replace('Bearer ', ''), { complete: true })
  }

export async function getUserFromEmail(
    email: string
  ): Promise<any> {
    const redisClient = await redisPool.acquire()
    console.log(redisClient)
    const userExist = await redisClient.get(email)
    redisPool.release(redisClient)
    return userExist
  }

export async function updateUserToken(
    email: string, access_token: string, refresh_token: string | undefined
  ): Promise<void> {
    const redisClient = await redisPool.acquire()
    const userExist = await redisClient.get(email)
    const userJSON = JSON.parse(userExist)
    userJSON.access_token = access_token

    if (refresh_token !== undefined) {
      userJSON.refresh_token = refresh_token
    } 
    const toStoreUpdate = JSON.stringify(userJSON)

    redisClient.set(email, toStoreUpdate, (err: any, result: any) => {
      if (err) {
        console.error('Erro ao definir chave:', err)
      } else {
        console.log('Token Atualizado', result)
      }
    })

    redisPool.release(redisClient)
  }
