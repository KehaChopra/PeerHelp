import { Router } from 'express'
import { getQuestions, postQuestion } from '../controllers/questions.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const questionsRouter = Router()

questionsRouter.get('/', getQuestions)
questionsRouter.post('/', requireAuth, postQuestion)

export default questionsRouter
