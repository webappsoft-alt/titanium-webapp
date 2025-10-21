export const QuoteItem = {
  productId: '',
  quantity: 0,
  specifications: {
    grade: '',
    dimensions: []
  },
  notes: ''
};

export const Category = {
  id: '',
  name: '',
  description: ''
};

export const Product = {
  id: '',
  name: '',
  category: '',
  type: '',
  form: '',
  description: '',
  imageUrl: '',
  specifications: {
    grades: [],
    dimensions: []
  }
};

export const User = {
  id: '',
  email: '',
  name: '',
  role: '',
  company: ''
};

export const Quote = {
  id: '',
  status: '',
  userId: '',
  user: {},
  items: [],
  pricing: {
    subtotal: 0,
    tax: 0,
    total: 0
  },
  leadTime: '',
  internalNotes: '',
  createdAt: new Date(),
  updatedAt: new Date()
};