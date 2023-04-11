import { Consumer, Menu, Provider } from '@prisma/client'
import { Request } from 'express'

type AutoGenKeys = 'id' | 'createdAt' | 'updatedAt'

export type RegisterConsumerInput = Omit<Consumer, AutoGenKeys>
export type RegisterProviderInput = Omit<Provider, AutoGenKeys>

export type Sesssion = {
    userId: number
}

export interface RequestSesh extends Request {
    session: Sesssion
}

export type CreateMenuInput = Omit<Menu, AutoGenKeys>

export type MenuWithMealStatus = Menu & {
    breakfastStatus: boolean // true if user will be attending the meal
    lunchStatus: boolean // true if user will be attending the meal
    snacksStatus: boolean // true if user will be attending the meal
    dinnerStatus: boolean // true if user will be attending the meal
}
