import { prisma } from '../lib/prisma.js'

export function listSubjects() {
  return prisma.subject.findMany({
    select: { id: true, name: true },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  })
}
