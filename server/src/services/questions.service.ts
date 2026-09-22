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

export function listQuestions() {
  return prisma.question.findMany({
    select: questionSelect,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  })
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
