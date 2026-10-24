import { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'

const questionSelect = {
  id: true,
  text: true,
  createdAt: true,
  author: { select: { id: true, name: true } },
  subject: { select: { id: true, name: true } },
} as const

export class SubjectNotFoundError extends Error {}
export class QuestionAuthorNotFoundError extends Error {}
export class QuestionRelationUnavailableError extends Error {}
export class QuestionNotFoundError extends Error {}

export async function listQuestions(input: { subjectId?: number; page: number; limit: number }) {
  const where = input.subjectId === undefined ? {} : { subjectId: input.subjectId }
  const [questions, total] = await prisma.$transaction([
    prisma.question.findMany({
      where,
      select: questionSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (input.page - 1) * input.limit,
      take: input.limit,
    }),
    prisma.question.count({ where }),
  ], {
    isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
  })

  const totalPages = Math.ceil(total / input.limit)

  return {
    questions,
    pagination: {
      page: input.page,
      limit: input.limit,
      total,
      totalPages,
      hasMore: input.page < totalPages,
    },
  }
}

export async function createQuestion(input: {
  text: string
  subjectId: number
  authorId: number
}) {
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId },
    select: { id: true },
  })

  if (!subject) {
    throw new SubjectNotFoundError('Selected subject does not exist')
  }

  const author = await prisma.user.findUnique({
    where: { id: input.authorId },
    select: { id: true },
  })

  if (!author) {
    throw new QuestionAuthorNotFoundError('User account is no longer available')
  }

  try {
    return await prisma.question.create({
      data: {
        text: input.text,
        authorId: input.authorId,
        subjectId: input.subjectId,
      },
      select: questionSelect,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new QuestionRelationUnavailableError('Subject or user account is no longer available')
    }

    throw error
  }
}

export async function findQuestionById(questionId: number) {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      ...questionSelect,
      _count: {
        select: {
          answers: true,
        },
      },
    },
  })

  if (!question) {
    throw new QuestionNotFoundError('Question not found')
  }

  const { _count, ...safeQuestion } = question

  return {
    ...safeQuestion,
    answerCount: _count.answers,
  }
}
