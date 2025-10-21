export const Product = {
  id: '',
  name: '',
  category: '',
  type: '',
  form: '',
  description: '',
  specifications: {
    grades: [],
    dimensions: []
  },
  pricing: {
    basePrice: 0,
    volumePricing: [],
    unit: ''
  },
  inventory: {
    quantity: 0,
    sku: '',
    location: ''
  },
  shipping: {
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    restrictions: []
  },
  variants: []
};

export const ProductVariant = {
  id: '',
  name: '',
  sku: '',
  specifications: {},
  pricing: {
    basePrice: 0,
    unit: ''
  },
  inventory: {
    quantity: 0,
    location: ''
  }
};