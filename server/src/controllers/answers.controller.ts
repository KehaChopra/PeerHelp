import type { Request, Response } from 'express'
import {
  AnswerAuthorNotFoundError,
  AnswerQuestionNotFoundError,
  AnswerRelationUnavailableError,
  createAnswer,
  listAnswersForQuestion,
} from '../services/answers.service.js'

interface CreateAnswerBody {
  text?: unknown
}

function parseQuestionId(value: unknown): number | null {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return null
  }

  const questionId = Number(value)

  if (!Number.isSafeInteger(questionId)) {
    return null
  }

  return questionId
}

function parseCreateAnswerBody(body: unknown): { text: string } | string {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return 'A valid request body is required'
  }

  const input = body as CreateAnswerBody

  if (typeof input.text !== 'string' || input.text.trim().length === 0) {
    return 'Answer text is required'
  }

  return { text: input.text.trim() }
}

export async function getAnswers(request: Request, response: Response): Promise<void> {
  const questionId = parseQuestionId(request.params.questionId)

  if (questionId === null) {
    response.status(400).json({
      success: false,
      message: 'A valid question ID is required',
    })
    return
  }

  try {
    const answers = await listAnswersForQuestion(questionId)
    response.status(200).json({ success: true, answers })
  } catch (error) {
    if (error instanceof AnswerQuestionNotFoundError) {
      response.status(404).json({ success: false, message: error.message })
      return
    }

    response.status(500).json({
      success: false,
      message: 'Unable to retrieve answers',
    })
  }
}

export async function postAnswer(request: Request, response: Response): Promise<void> {
  const authorId = request.auth?.userId

  if (!authorId) {
    response.status(401).json({
      success: false,
      message: 'Authentication is required',
    })
    return
  }

  const questionId = parseQuestionId(request.params.questionId)

  if (questionId === null) {
    response.status(400).json({
      success: false,
      message: 'A valid question ID is required',
    })
    return
  }

  const input = parseCreateAnswerBody(request.body)

  if (typeof input === 'string') {
    response.status(400).json({ success: false, message: input })
    return
  }

  try {
    const answer = await createAnswer({ ...input, questionId, authorId })
    response.status(201).json({ success: true, answer })
  } catch (error) {
    if (error instanceof AnswerQuestionNotFoundError) {
      response.status(404).json({ success: false, message: error.message })
      return
    }

    if (error instanceof AnswerAuthorNotFoundError) {
      response.status(401).json({ success: false, message: error.message })
      return
    }

    if (error instanceof AnswerRelationUnavailableError) {
      response.status(400).json({ success: false, message: error.message })
      return
    }

    response.status(500).json({
      success: false,
      message: 'Unable to post answer',
    })
  }
}
