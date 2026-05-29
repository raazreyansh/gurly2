import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

function withServerlessConnectionLimit(databaseUrl?: string) {
  if (!databaseUrl) return databaseUrl

  try {
    const url = new URL(databaseUrl)
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '1')
    }
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '20')
    }
    return url.toString()
  } catch {
    return databaseUrl
  }
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: withServerlessConnectionLimit(process.env.DATABASE_URL),
      },
    },
  })
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
