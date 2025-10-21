import { processCSVFile } from './csv';
import { processFile as processExcelFile } from './excel';
import { useProductStore } from '@/store/product-store';
import { toast } from 'react-hot-toast';
import { validateRow } from './validation';

export async function importProducts(file, options) {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  try {
    let rawData;
    
    if (fileType === 'csv') {
      rawData = await processCSVFile(file);
    } else if (['xlsx', 'xls'].includes(fileType || '')) {
      const results = await processExcelFile(file);
      rawData = Object.values(results).flat();
    } else {
      throw new Error('Unsupported file type. Please use CSV or Excel files.');
    }

    const errors = [];
    const warnings = [];
    const validProducts = [];

    for (let i = 0; i < rawData.length; i++) {
      const validationResult = validateRow(rawData[i], options.productType, i + 1);
      
      if (!validationResult.valid) {
        errors.push(...(validationResult.errors || []));
      } else {
        validProducts.push(validationResult.data);
      }

      if (validationResult.warnings) {
        warnings.push(...validationResult.warnings);
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        warnings,
        count: validProducts.length
      };
    }

    if (options.validateOnly) {
      return {
        valid: true,
        warnings,
        count: validProducts.length
      };
    }

    const { addProducts } = useProductStore.getState();
    addProducts(validProducts);

    return {
      valid: true,
      warnings,
      count: validProducts.length,
      success: true,
      products: validProducts
    };
  } catch (error) {
    console.error('Import error:', error);
    toast.error(error.message || 'Failed to import products');
    throw error;
  }
}