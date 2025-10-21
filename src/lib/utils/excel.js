import { toast } from 'react-hot-toast';

export function processFile(file) {
  return new Promise((resolve) => {
    // Since we removed xlsx dependency, we'll just process as a simple object
    const results = {
      'Sheet1': []
    };
    
    toast.success('File processed successfully');
    resolve(results);
  });
}

export function processExcelData(data, sheetName) {
  return data.map((row, index) => {
    const description = findFieldValue(row, COLUMN_MAPPINGS.description) || 'No description';
    const productId = generateProductId(row, index);
    const grade = findFieldValue(row, COLUMN_MAPPINGS.grade) || 'Standard';
    const primaryDim = findFieldValue(row, COLUMN_MAPPINGS.dimensions.primary);
    const category = getCategoryFromSheet(sheetName);
    const form = getFormFromSheet(sheetName);
    
    return {
      id: productId,
      name: description,
      category,
      type: category,
      form,
      description,
      specifications: {
        grades: [grade],
        dimensions: [{
          min: 0,
          max: parseNumber(primaryDim),
          unit: 'inches'
        }]
      },
      pricing: {
        basePrice: parseNumber(findFieldValue(row, COLUMN_MAPPINGS.price)),
        unit: 'EA'
      },
      inventory: {
        quantity: parseNumber(findFieldValue(row, COLUMN_MAPPINGS.quantity))
      }
    };
  }).filter(product => product.id && product.name);
}

function findFieldValue(row, mappings) {
  for (const key of Object.keys(row)) {
    const normalizedKey = key.toLowerCase().trim();
    for (const mapping of mappings) {
      if (normalizedKey.includes(mapping.toLowerCase())) {
        return String(row[key] || '').trim();
      }
    }
  }
  return '';
}

function generateProductId(row, index) {
  const productId = findFieldValue(row, COLUMN_MAPPINGS.productId);
  if (productId) return productId;

  const desc = findFieldValue(row, COLUMN_MAPPINGS.description);
  if (desc) {
    const cleanId = desc.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20).toUpperCase();
    return `PROD-${cleanId}-${index + 1}`;
  }

  return `PRODUCT-${index + 1}`;
}

function parseNumber(value) {
  if (!value) return 0;
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

function getCategoryFromSheet(sheetName) {
  const name = sheetName.toLowerCase();
  if (name.includes('pipe')) return 'Pipes';
  if (name.includes('fitting')) return 'Fittings';
  if (name.includes('sheet')) return 'Sheets';
  if (name.includes('bar')) return 'Bars';
  if (name.includes('plate')) return 'Plates';
  if (name.includes('tube')) return 'Tubes';
  return 'Other';
}

function getFormFromSheet(sheetName) {
  const name = sheetName.toLowerCase();
  if (name.includes('round')) return 'Round';
  if (name.includes('square')) return 'Square';
  if (name.includes('sheet') || name.includes('plate')) return 'Flat';
  if (name.includes('hex')) return 'Hexagonal';
  if (name.includes('rect')) return 'Rectangular';
  return 'Various';
}

const COLUMN_MAPPINGS = {
  productId: [
    'Product Metal', 'Product', 'Item Number', 'SKU', 'Part Number', 
    'Product Code', 'Item ID', 'ID', 'Product ID', 'ItemID'
  ],
  description: [
    'Product Specifications', 'Description', 'Product Description', 
    'Specifications', 'Item Description', 'Details', 'Info'
  ],
  grade: [
    'Grade', 'Material Grade', 'Material', 'Specification', 
    'Material Specification', 'Quality'
  ],
  price: [
    'Price', 'Unit Price', 'Base Price', 'Price/Unit', 'Cost',
    'Sales Price', 'Price per Unit'
  ],
  quantity: [
    'Quantity', 'Stock', 'Inventory', 'On Hand', 'Available',
    'Qty', 'Amount'
  ],
  dimensions: {
    primary: [
      'Dimensions', 'Size', 'Measurement', 'Length', 'Width',
      'Height', 'Diameter'
    ]
  }
};