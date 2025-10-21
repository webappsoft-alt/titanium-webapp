import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const createQuoteSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      specifications: z.record(z.any()),
    })
  ),
});

export const updateQuoteSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED']),
  pricing: z.object({
    subtotal: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().min(0),
  }).optional(),
  leadTime: z.string().optional(),
  internalNotes: z.string().optional(),
});

export async function createQuote(userId, data) {
  return prisma.quote.create({
    data: {
      userId,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          specifications: item.specifications,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function updateQuote(id, data) {
  return prisma.quote.update({
    where: { id },
    data,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getQuotes(userId) {
  return prisma.quote.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getQuote(id) {
  return prisma.quote.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
        },
      },
    },
  });
}