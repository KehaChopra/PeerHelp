import { Router } from 'express'
import { getMe, login, signup } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.get('/me', requireAuth, getMe)

export default authRouter
