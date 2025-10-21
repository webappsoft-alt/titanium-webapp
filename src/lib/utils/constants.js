export const productForms = [
  { value: 'Round Bar', label: 'Round Bar', dimensions: ['diameter', 'length'] },
  { value: 'Wire', label: 'Wire', dimensions: ['diameter', 'length'] },
  { value: 'Hex Bar', label: 'Hex Bar', dimensions: ['across-flats', 'length'] },
  { value: 'Block', label: 'Block', dimensions: ['width', 'height', 'length'] },
  { value: 'Plate', label: 'Plate', dimensions: ['thickness', 'width', 'length'] },
  { value: 'Sheet', label: 'Sheet', dimensions: ['thickness', 'width', 'length'] },
  { value: 'Pipe', label: 'Pipe', dimensions: ['outer-diameter', 'wall-thickness', 'length'] },
  { value: 'Tube', label: 'Tube', dimensions: ['outer-diameter', 'wall-thickness', 'length'] }
];

export const metalFamilies = {
  'Alloy Steel': {
    value: 'alloy-steel',
    label: 'Alloy Steel',
    density: 0.284,
    grades: [
      { value: '4137', label: '4137', density: 0.284 },
      { value: '4140', label: '4140', density: 0.284 },
      { value: '4340', label: '4340', density: 0.284 }
    ]
  },
  'Stainless Steel': {
    value: 'stainless-steel',
    label: 'Stainless Steel',
    density: 0.290,
    grades: [
      { value: '304', label: '304', density: 0.290 },
      { value: '316', label: '316L', density: 0.290 },
      { value: '321', label: '321', density: 0.290 }
    ]
  },
  'Titanium': {
    value: 'titanium',
    label: 'Titanium',
    density: 0.163,
    grades: [
      { value: 'grade-2', label: 'Grade 2', density: 0.163 },
      { value: 'grade-5', label: 'Grade 5 (Ti-6Al-4V)', density: 0.163 },
      { value: 'grade-7', label: 'Grade 7', density: 0.163 }
    ]
  },
  'Nickel Alloy': {
    value: 'nickel-alloy',
    label: 'Nickel Alloy',
    density: 0.308,
    grades: [
      { value: '625', label: 'Alloy 625', density: 0.308 },
      { value: '718', label: 'Alloy 718', density: 0.308 }
    ]
  }
};

export const tolerances = [
  { value: 'with', label: 'With Tolerances' },
  { value: 'without', label: 'Without Tolerances' }
];

export const units = [
  { value: 'in', label: 'inches' },
  { value: 'ft', label: 'feet' },
  { value: 'mm', label: 'millimeters' },
  { value: 'm', label: 'meters' }
];

export const dimensionTolerances = {
  'Round Bar': {
    diameter: { value: 0.002, unit: 'in' },
    length: { value: 0.078, unit: 'in' }
  }
};

export const newMetalFamily = ['Titanium', 'Nickel Alloy', 'Stainless Steel', 'Cobalt Chrome', 'Alloy Steel', 'Aluminum', 'Carbon Steel', 'Tool Steel']