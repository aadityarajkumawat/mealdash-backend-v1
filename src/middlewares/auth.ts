import { NextFunction, Request, Response } from 'express'
import { SessionManager } from '../utils'

export function auth(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const sesh = SessionManager.decode(authorization)
    if (!sesh) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // @ts-ignore
    req.session = sesh

    return next()
}
