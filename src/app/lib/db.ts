// src/app/lib/db.ts
import { PrismaClient } from '@prisma/client'

// Type-safe global variable declaration
declare global {
  var prisma: PrismaClient | undefined
}

// Initialize Prisma Client only once
const prismaClient = () => {
  if (!global.prisma) {
    console.log('Creating new Prisma Client instance')
    global.prisma = new PrismaClient({
      log: ['error'] // Only show errors in production
    })
  }
  return global.prisma
}

// Export a singleton instance
const prisma = prismaClient()
export default prisma