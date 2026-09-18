import type { Request, Response } from 'express'
import { listSubjects } from '../services/subjects.service.js'

export async function getSubjects(_request: Request, response: Response): Promise<void> {
  try {
    const subjects = await listSubjects()
    response.status(200).json({ success: true, subjects })
  } catch {
    response.status(500).json({ success: false, message: 'Unable to retrieve subjects' })
  }
}
