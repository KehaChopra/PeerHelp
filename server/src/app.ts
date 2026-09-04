import cors from 'cors'
import express from 'express'
import authRouter from './routes/auth.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'PeerHelp API is running',
  })
})

export default app
