import bcrypt from 'bcrypt'
import { createAuthToken } from '../config/jwt.js'
import { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'

const PASSWORD_SALT_ROUNDS = 12

export interface SignupInput {
  name: string
  email: string
  password: string
  year: number
  subjectIds: number[]
}

export interface LoginInput {
  email: string
  password: string
}

export class EmailAlreadyExistsError extends Error {}
export class InvalidSubjectsError extends Error {}
export class InvalidCredentialsError extends Error {}

export async function signupUser(input: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  })

  if (existingUser) {
    throw new EmailAlreadyExistsError('An account with this email already exists')
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS)

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        year: input.year,
        subjects:
          input.subjectIds.length > 0
            ? {
                create: input.subjectIds.map((subjectId) => ({
                  subject: { connect: { id: subjectId } },
                })),
              }
            : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        isOnline: true,
        createdAt: true,
        updatedAt: true,
        subjects: {
          select: { subjectId: true },
        },
      },
    })

    const { subjects, ...safeUser } = user

    return {
      ...safeUser,
      subjectIds: subjects.map(({ subjectId }) => subjectId),
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new EmailAlreadyExistsError('An account with this email already exists')
      }

      if (error.code === 'P2018' || error.code === 'P2025') {
        throw new InvalidSubjectsError('One or more selected subjects do not exist')
      }
    }

    throw error
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      year: true,
      isOnline: true,
      createdAt: true,
      updatedAt: true,
      subjects: {
        select: { subjectId: true },
      },
    },
  })

  if (!user) {
    throw new InvalidCredentialsError('Invalid email or password')
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash)

  if (!passwordMatches) {
    throw new InvalidCredentialsError('Invalid email or password')
  }

  const token = createAuthToken(user.id)
  const { passwordHash: _passwordHash, subjects, ...safeUser } = user

  return {
    token,
    user: {
      ...safeUser,
      subjectIds: subjects.map(({ subjectId }) => subjectId),
    },
  }
}

export async function getAuthenticatedUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      year: true,
      isOnline: true,
      createdAt: true,
      updatedAt: true,
      subjects: {
        select: { subjectId: true },
      },
    },
  })

  if (!user) return null

  const { subjects, ...safeUser } = user

  return {
    ...safeUser,
    subjectIds: subjects.map(({ subjectId }) => subjectId),
  }
}
