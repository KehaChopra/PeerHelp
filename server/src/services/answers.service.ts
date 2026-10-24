import { Prisma } from '../generated/prisma/client.js'
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
export class AnswerAuthorNotFoundError extends Error {}
export class AnswerRelationUnavailableError extends Error {}

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

export async function createAnswer(input: {
  text: string
  questionId: number
  authorId: number
}) {
  const question = await prisma.question.findUnique({
    where: { id: input.questionId },
    select: { id: true },
  })

  if (!question) {
    throw new AnswerQuestionNotFoundError('Question not found')
  }

  const author = await prisma.user.findUnique({
    where: { id: input.authorId },
    select: { id: true },
  })

  if (!author) {
    throw new AnswerAuthorNotFoundError('User account is no longer available')
  }

  try {
    return await prisma.answer.create({
      data: {
        text: input.text,
        questionId: input.questionId,
        authorId: input.authorId,
      },
      select: answerSelect,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new AnswerRelationUnavailableError(
        'Question or user account is no longer available',
      )
    }

    throw error
  }
}
