import type { Request, Response } from 'express'
import {
  createQuestion,
  findQuestionById,
  listQuestions,
  QuestionAuthorNotFoundError,
  QuestionNotFoundError,
  QuestionRelationUnavailableError,
  SubjectNotFoundError,
} from '../services/questions.service.js'

interface CreateQuestionBody {
  text?: unknown
  subjectId?: unknown
}

function parseCreateQuestionBody(body: unknown): { text: string; subjectId: number } | string {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return 'A valid request body is required'
  }

  const input = body as CreateQuestionBody

  if (typeof input.text !== 'string' || input.text.trim().length === 0) {
    return 'Question text is required'
  }

  if (!Number.isSafeInteger(input.subjectId) || (input.subjectId as number) <= 0) {
    return 'A valid subject ID is required'
  }

  return { text: input.text.trim(), subjectId: input.subjectId as number }
}

export async function getQuestions(_request: Request, response: Response): Promise<void> {
  try {
    const questions = await listQuestions()
    response.status(200).json({ success: true, questions })
  } catch {
    response.status(500).json({ success: false, message: 'Unable to retrieve questions' })
  }
}

export async function postQuestion(request: Request, response: Response): Promise<void> {
  const authorId = request.auth?.userId

  if (!authorId) {
    response.status(401).json({ success: false, message: 'Authentication is required' })
    return
  }

  const input = parseCreateQuestionBody(request.body)

  if (typeof input === 'string') {
    response.status(400).json({ success: false, message: input })
    return
  }

  try {
    const question = await createQuestion({ ...input, authorId })
    response.status(201).json({ success: true, question })
  } catch (error) {
    if (error instanceof SubjectNotFoundError || error instanceof QuestionRelationUnavailableError) {
      response.status(400).json({ success: false, message: error.message })
      return
    }

    if (error instanceof QuestionAuthorNotFoundError) {
      response.status(401).json({ success: false, message: error.message })
      return
    }

    response.status(500).json({ success: false, message: 'Unable to post question' })
  }
}

export async function getQuestion(
  request: Request,
  response: Response,
): Promise<void> {
  const rawId = request.params.questionId

  if (typeof rawId !== 'string' || !/^[1-9]\d*$/.test(rawId)) {
    response.status(400).json({
      success: false,
      message: 'A valid question ID is required',
    })
    return
  }

  const questionId = Number(rawId)

  if (!Number.isSafeInteger(questionId) || questionId > 2147483647) {
    response.status(400).json({
      success: false,
      message: 'A valid question ID is required',
    })
    return
  }

  try {
    const question = await findQuestionById(questionId)

    response.status(200).json({
      success: true,
      question,
    })
  } catch (error) {
    if (error instanceof QuestionNotFoundError) {
      response.status(404).json({
        success: false,
        message: error.message,
      })
      return
    }

    response.status(500).json({
      success: false,
      message: 'Unable to retrieve question',
    })
  }
}
