import { prisma } from '../src/lib/prisma.js'

const subjectNames = [
  'Data Structures and Algorithms',
  'Database Management Systems',
  'Computer Networks',
  'Operating Systems',
]

try {
  const result = await prisma.subject.createMany({
    data: subjectNames.map((name) => ({ name })),
    skipDuplicates: true,
  })

  console.log(`Subject seed complete: ${result.count} inserted, ${subjectNames.length - result.count} already present.`)
} catch (error) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : 'unknown'

  console.error(`Subject seed failed (code: ${code}).`)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
