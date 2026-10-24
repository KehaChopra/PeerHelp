import { Router } from 'express'
import { getAnswers, postAnswer } from '../controllers/answers.controller.js'
import { getQuestions, postQuestion } from '../controllers/questions.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const questionsRouter = Router()

questionsRouter.get('/', getQuestions)
questionsRouter.get('/:questionId/answers', getAnswers)
questionsRouter.post('/:questionId/answers', requireAuth, postAnswer)
questionsRouter.post('/', requireAuth, postQuestion)

export default questionsRouter
