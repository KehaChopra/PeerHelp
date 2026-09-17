import 'dotenv/config'
import jwt from 'jsonwebtoken'

const JWT_EXPIRATION = '1d'

export function createAuthToken(userId: number): string {
  const secret = process.env.JWT_SECRET

  if (!secret?.trim()) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign({ userId }, secret, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRATION,
  })
}

export function verifyAuthToken(token: string): number {
  const secret = process.env.JWT_SECRET

  if (!secret?.trim()) {
    throw new Error('JWT_SECRET is not configured')
  }

  const payload = jwt.verify(token, secret, { algorithms: ['HS256'] })

  if (
    typeof payload === 'string' ||
    typeof payload.userId !== 'number' ||
    !Number.isInteger(payload.userId) ||
    payload.userId <= 0
  ) {
    throw new jwt.JsonWebTokenError('Token payload is invalid')
  }

  return payload.userId
}
