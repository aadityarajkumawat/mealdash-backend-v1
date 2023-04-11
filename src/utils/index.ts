import { Sesssion } from '../types'

const encode = (userId: string) => {
    return Buffer.from(JSON.stringify({ userId })).toString('base64')
}

const decode = (hash: string) => {
    try {
        const sesh = JSON.parse(
            Buffer.from(hash, 'base64').toString('utf-8'),
        ) as Sesssion

        return sesh
    } catch (error) {
        return null
    }
}

const SessionManager = {
    encode,
    decode,
}

export { SessionManager }
