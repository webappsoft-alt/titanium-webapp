import { z } from 'zod';

const dimensionSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  unit: z.string(),
});

const baseProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be 0 or greater'),
});

export const pipeFittingsSchema = baseProductSchema.extend({
  type: z.enum(['pipe', 'fitting']),
  material: z.string(),
  connectionType: z.string(),
  pressure: z.number().optional(),
  dimensions: z.array(dimensionSchema),
});

export const millProductsSchema = baseProductSchema.extend({
  type: z.enum(['sheet', 'plate', 'bar', 'tube']),
  grade: z.string(),
  finish: z.string().optional(),
  dimensions: z.array(dimensionSchema),
});

export const marginGuidelinesSchema = baseProductSchema.extend({
  margin: z.number().min(0).max(100),
  minimumMargin: z.number().min(0).max(100).optional(),
  volumeDiscounts: z.array(
    z.object({
      quantity: z.number().min(1),
      margin: z.number().min(0).max(100),
    })
  ).optional(),
});

export function validateRow(data, type, rowIndex) {
  try {
    let schema;
    switch (type) {
      case 'pipe-fittings':
        schema = pipeFittingsSchema;
        break;
      case 'mill-products':
        schema = millProductsSchema;
        break;
      case 'margin-guidelines':
        schema = marginGuidelinesSchema;
        break;
      default:
        throw new Error('Invalid product type');
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map((err) => ({
          row: rowIndex,
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    return {
      valid: true,
      data: result.data,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        row: rowIndex,
        field: 'unknown',
        message: error.message,
      }],
    };
  }
}