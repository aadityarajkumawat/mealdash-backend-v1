import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import consumerRouter from './routes/consumer'
import providerRouter from './routes/provider'
dotenv.config()

const app = express()

/** Middleware */
app.use(express.json())
app.use(cors())

/** Routes */
app.use('/consumer', consumerRouter)
app.use('/provider', providerRouter)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
