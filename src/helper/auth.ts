require("dotenv").config()
export const hasAuth = (headerToken: string) => {
    const api = process.env.API_AUTH
    console.log(api, 'api')
    console.log(headerToken, 'headerToken')
    return headerToken !== api
}