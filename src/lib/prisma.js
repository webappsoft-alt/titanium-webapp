import { PrismaClient } from '@prisma/client';

// Declare global variable for prisma client
let prisma;

// Check if we're in development and reuse client if it exists
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, create global prisma client to prevent too many instances
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };