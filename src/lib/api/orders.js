import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const createOrderSchema = z.object({
  quoteId: z.string(),
  total: z.number().min(0),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
});

export async function createOrder(userId, data) {
  return prisma.order.create({
    data: {
      userId,
      quoteId: data.quoteId,
      total: data.total,
    },
    include: {
      quote: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

export async function updateOrder(id, data) {
  return prisma.order.update({
    where: { id },
    data,
    include: {
      quote: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      quote: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getOrder(id) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      quote: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
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