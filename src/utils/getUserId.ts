import { Request } from 'express'

export function getUserId(req: Request): string {
    // @ts-ignore
    const { userId } = req.session

    return userId
}
