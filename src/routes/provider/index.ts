import express from 'express'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../prisma'
import { CreateMenuInput, RegisterProviderInput } from '../../types'
import { SessionManager } from '../../utils'

const router = express.Router()

router.get('/details', auth, async (req, res) => {
    // @ts-ignore
    const { userId } = req.session

    try {
        const provider = await prisma.provider.findUnique({
            where: { id: userId },
        })

        res.status(201).json({ provider, error: null })
    } catch (error) {
        res.status(400).json({ provider: null, error })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.provider.findUnique({
            where: {
                email,
            },
        })

        if (!user || user.password !== password) {
            throw new Error('Email or Password is invalid')
        }

        const token = SessionManager.encode(user.id)

        return res.status(201).json({ token, error: null })
    } catch (error) {
        return res.status(400).json({ token: null, error: error.message })
    }
})

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body as RegisterProviderInput

    try {
        const user = await prisma.provider.create({
            data: {
                email,
                password,
                name,
                role: 'MESS_STAFF',
            },
        })

        const token = SessionManager.encode(user.id)

        return res.status(201).json({ token, error: null })
    } catch (error) {
        return res.status(400).json({ token: null, error })
    }
})

router.post('/menu', auth, async (req, res) => {
    const data = req.body as CreateMenuInput

    try {
        const menu = await prisma.menu.create({
            data,
        })

        return res.status(201).json({ menu, error: null })
    } catch (error) {
        return res.status(400).json({ menu: null, error })
    }
})

export default router
