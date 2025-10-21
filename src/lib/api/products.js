import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  type: z.string(),
  form: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  specifications: z.object({
    grades: z.array(z.string()),
    dimensions: z.array(z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string(),
    })),
  }),
});

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getProduct(id) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function createProduct(data) {
  return prisma.product.create({
    data,
  });
}

export async function updateProduct(id, data) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id) {
  return prisma.product.delete({
    where: { id },
  });
}