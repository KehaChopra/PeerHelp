import { Router } from 'express'
import { getSubjects } from '../controllers/subjects.controller.js'

const subjectsRouter = Router()

subjectsRouter.get('/', getSubjects)

export default subjectsRouter
