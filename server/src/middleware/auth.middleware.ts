import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { verifyAuthToken } from '../config/jwt.js'

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.get('authorization')

  if (!authorization) {
    response.status(401).json({ success: false, message: 'Authentication token is required' })
    return
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorization)

  if (!match) {
    response.status(401).json({ success: false, message: 'Invalid authorization header' })
    return
  }

  try {
    request.auth = { userId: verifyAuthToken(match[1]) }
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      response.status(401).json({ success: false, message: 'Invalid or expired authentication token' })
      return
    }

    next(error)
  }
}
