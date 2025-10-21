import Papa from 'papaparse';
import { toast } from 'react-hot-toast';

const REQUIRED_FIELDS = ['name', 'category', 'price', 'quantity'];

export function processCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const products = validateAndTransformData(results.data);
          resolve(products);
        } catch (error) {
          reject(new Error(error.message));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

function validateAndTransformData(data) {
  if (data.length === 0) {
    throw new Error('CSV file is empty');
  }

  const headers = Object.keys(data[0]).map(h => h.toLowerCase());
  const missingFields = REQUIRED_FIELDS.filter(field => 
    !headers.some(h => h.includes(field))
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
  }

  return data.map((row, index) => {
    try {
      validateRow(row);
      return transformRow(row);
    } catch (error) {
      throw new Error(`Error in row ${index + 2}: ${error.message}`);
    }
  });
}

function validateRow(row) {
  for (const field of REQUIRED_FIELDS) {
    const value = findFieldValue(row, field);
    if (!value) {
      throw new Error(`Missing required value for "${field}"`);
    }
  }

  const price = parseFloat(findFieldValue(row, 'price'));
  if (isNaN(price) || price < 0) {
    throw new Error(`Invalid price: ${findFieldValue(row, 'price')}`);
  }

  const quantity = parseInt(findFieldValue(row, 'quantity'));
  if (isNaN(quantity) || quantity < 0) {
    throw new Error(`Invalid quantity: ${findFieldValue(row, 'quantity')}`);
  }
}

function findFieldValue(row, field) {
  const key = Object.keys(row).find(k => 
    k.toLowerCase().includes(field.toLowerCase())
  );
  return key ? row[key].trim() : '';
}

function transformRow(row) {
  return {
    id: findFieldValue(row, 'id') || `PROD-${Math.random().toString(36).substr(2, 9)}`,
    name: findFieldValue(row, 'name'),
    category: findFieldValue(row, 'category'),
    type: findFieldValue(row, 'type') || findFieldValue(row, 'category'),
    form: findFieldValue(row, 'form') || 'Standard',
    description: findFieldValue(row, 'description') || findFieldValue(row, 'name'),
    specifications: {
      grades: [findFieldValue(row, 'grade') || 'Standard'],
      dimensions: [{
        min: 0,
        max: parseFloat(findFieldValue(row, 'dimensions')) || 0,
        unit: 'inches'
      }]
    },
    pricing: {
      basePrice: parseFloat(findFieldValue(row, 'price')),
      unit: 'EA'
    },
    inventory: {
      quantity: parseInt(findFieldValue(row, 'quantity'))
    }
  };
}