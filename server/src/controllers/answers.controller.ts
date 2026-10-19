import type { Request, Response } from 'express'
import {
  AnswerQuestionNotFoundError,
  listAnswersForQuestion,
} from '../services/answers.service.js'

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
