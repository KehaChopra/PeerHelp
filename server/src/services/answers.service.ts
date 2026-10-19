import { prisma } from '../lib/prisma.js'

const answerSelect = {
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
    },
  },
} as const

export class AnswerQuestionNotFoundError extends Error {}

export async function listAnswersForQuestion(questionId: number) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true },
  })

  if (!question) {
    throw new AnswerQuestionNotFoundError('Question not found')
  }

  return prisma.answer.findMany({
    where: { questionId },
    select: answerSelect,
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  })
}
