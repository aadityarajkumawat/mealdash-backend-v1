import { MealType } from '@prisma/client'
import express from 'express'
import { auth } from '../../middlewares/auth'
import { prisma } from '../../prisma'
import { MenuWithMealStatus, RegisterConsumerInput } from '../../types'
import { SessionManager } from '../../utils'
import { getUserId } from '../../utils/getUserId'

const router = express.Router()

router.get('/details', auth, async (req, res) => {
    // @ts-ignore
    const { userId } = req.session

    try {
        const consumer = await prisma.consumer.findUnique({
            where: { id: userId },
        })

        res.status(201).json({ consumer, error: null })
    } catch (error) {
        res.status(400).json({ consumer: null, error })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.consumer.findUnique({
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
    const { email, password, name, type } = req.body as RegisterConsumerInput

    try {
        const user = await prisma.consumer.create({
            data: {
                email,
                password,
                name,
                type,
            },
        })

        const token = SessionManager.encode(user.id)

        return res.status(201).json({ token, error: null })
    } catch (error) {
        return res.status(400).json({ token: null, error })
    }
})

router.get('/menu', auth, async (req, res) => {
    const userId = getUserId(req)
    try {
        const user = await prisma.consumer.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) throw new Error('User not found')

        const menu = await prisma.menu.findFirst({
            where: {
                date: new Date().toLocaleDateString(),
            },
        })

        if (!menu) throw new Error('Menu not found')

        const defaultMealStatus = user.type === 'HOSTLER'

        const mealWithStatus: MenuWithMealStatus = {
            ...menu,
            breakfastStatus: defaultMealStatus,
            lunchStatus: defaultMealStatus,
            snacksStatus: defaultMealStatus,
            dinnerStatus: defaultMealStatus,
        }

        const mealStatus = await prisma.mealStatus.findMany({
            where: {
                date: new Date().toLocaleDateString(),
                userId,
            },
        })

        for (const meal of mealStatus) {
            const key = `${
                meal.mealType.toLocaleLowerCase() as Lowercase<MealType>
            }Status` as const
            mealWithStatus[key] = !defaultMealStatus
        }

        return res.status(201).json({ menu: mealWithStatus, error: null })
    } catch (error) {
        return res.status(400).json({ menu: null, error })
    }
})

router.post('/toggle-meal', auth, async (req, res) => {
    let { mealType } = req.body as { mealType: MealType }
    // @ts-ignore
    const userId = req.session.userId

    mealType = mealType.toUpperCase() as MealType

    try {
        const count = await prisma.mealStatus.count({
            where: {
                date: new Date().toLocaleDateString(),
                mealType,
                userId,
            },
        })

        /**
         * count = 0 means, if user is hostler he is not taking meal,
         * and the user is day scholar he is taking meal
         */
        if (count === 0) {
            await prisma.mealStatus.create({
                data: {
                    date: new Date().toLocaleDateString(),
                    mealType,
                    userId,
                },
            })
        } else {
            await prisma.mealStatus.deleteMany({
                where: {
                    date: new Date().toLocaleDateString(),
                    mealType,
                    userId,
                },
            })
        }

        return res.status(201).json({ success: true, error: null })
    } catch (error) {
        return res.status(400).json({ success: false, error })
    }
})

export default router
