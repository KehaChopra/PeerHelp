import type { Request, Response } from 'express'
import {
  EmailAlreadyExistsError,
  InvalidSubjectsError,
  signupUser,
  type SignupInput,
} from '../services/auth.service.js'

interface SignupRequestBody {
  name?: unknown
  email?: unknown
  password?: unknown
  year?: unknown
  subjectIds?: unknown
}

function parseSignupBody(body: unknown): SignupInput | string {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return 'A valid request body is required'
  }

  const input = body as SignupRequestBody

  if (typeof input.name !== 'string' || input.name.trim().length === 0) {
    return 'Name is required'
  }

  if (typeof input.email !== 'string') {
    return 'A valid email is required'
  }

  const email = input.email.trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    return 'A valid email is required'
  }

  if (typeof input.password !== 'string' || input.password.length < 8) {
    return 'Password must be at least 8 characters long'
  }

  if (!Number.isInteger(input.year) || (input.year as number) < 1 || (input.year as number) > 4) {
    return 'Year must be an integer between 1 and 4'
  }

  if (
    input.subjectIds !== undefined &&
    (!Array.isArray(input.subjectIds) ||
      !input.subjectIds.every((subjectId) => Number.isInteger(subjectId) && subjectId > 0))
  ) {
    return 'Subject IDs must be an array of positive integers'
  }

  return {
    name: input.name.trim(),
    email,
    password: input.password,
    year: input.year as number,
    subjectIds: Array.from(new Set((input.subjectIds as number[] | undefined) ?? [])),
  }
}

export async function signup(request: Request, response: Response): Promise<void> {
  const parsedBody = parseSignupBody(request.body)

  if (typeof parsedBody === 'string') {
    response.status(400).json({ success: false, message: parsedBody })
    return
  }

  try {
    const user = await signupUser(parsedBody)
    response.status(201).json({ success: true, user })
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      response.status(409).json({ success: false, message: error.message })
      return
    }

    if (error instanceof InvalidSubjectsError) {
      response.status(400).json({ success: false, message: error.message })
      return
    }

    response.status(500).json({ success: false, message: 'Unable to create account' })
  }
}
