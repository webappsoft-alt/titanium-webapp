export const productForms = [
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/round.png', value: 'Round Bar', label: 'Round Bar', alloyType: 'require',
    dimensions: ['diameter', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/wire.png', value: 'Wire', label: 'Wire', alloyType: '',
    dimensions: ['diameter', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/hex.png', value: 'Hex Bar', label: 'Hex Bar', alloyType: '',
    dimensions: ['hexAF', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/block.png', value: 'Block', label: 'Block', alloyType: '',
    dimensions: ['width', 'thickness', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/flat.png', value: 'Plate', label: 'Plate', alloyType: '',
    dimensions: ['width', 'thickness', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/flat.png', value: 'Rectangular Bar', label: 'Rectangular Bar', alloyType: '',
    dimensions: ['thickness', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/flat.png', value: 'Sheet', label: 'Sheet', alloyType: '',
    dimensions: ['thickness', 'width', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/hollow.png', value: 'Hollow Bar', label: 'Hollow Bar', alloyType: '',
    dimensions: ['outer-diameter', 'inside-diameter', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/tube.png', value: 'Seamless Pipe', label: 'Seamless Pipe', alloyType: '',
    dimensions: ['outer-diameter', 'wall-thickness', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/tube.png', value: 'Welded Pipe', label: 'Welded Pipe', alloyType: '',
    dimensions: ['outer-diameter', 'wall-thickness', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/tube.png', value: 'Seamless Tube', label: 'Seamless Tube', alloyType: '',
    dimensions: ['outer-diameter', 'wall-thickness', 'length']
  },
  {
    img: 'https://shop.titanium.com/shop/images/weight_calculator/tube.png', value: 'Welded Tube', label: 'Welded Tube', alloyType: '',
    dimensions: ['outer-diameter', 'wall-thickness', 'length']
  }
];

export const productFormImages = {
  'Round Bar': 'https://shop.titanium.com/shop/images/weight_calculator/round.png',
  'Wire': 'https://shop.titanium.com/shop/images/weight_calculator/wire.png',
  'Hex Bar': 'https://shop.titanium.com/shop/images/weight_calculator/hex.png',
  'Block': 'https://shop.titanium.com/shop/images/weight_calculator/block.png',
  'Plate': 'https://shop.titanium.com/shop/images/weight_calculator/flat.png',
  'Rectangular Bar': 'https://shop.titanium.com/shop/images/weight_calculator/flat.png',
  'Sheet': 'https://shop.titanium.com/shop/images/weight_calculator/flat.png',
  'Hollow Bar': 'https://shop.titanium.com/shop/images/weight_calculator/hollow.png',
  'Seamless Pipe': 'https://shop.titanium.com/shop/images/weight_calculator/tube.png',
  'Welded Pipe': 'https://shop.titanium.com/shop/images/weight_calculator/tube.png',
  'Seamless Tube': 'https://shop.titanium.com/shop/images/weight_calculator/tube.png',
  'Welded Tube': 'https://shop.titanium.com/shop/images/weight_calculator/tube.png'
};

export const metalFamilies = {
  'Round Bar': [
    'Alloy Steel',
    'Aluminum Alloy',
    'Carbon Steel',
    'Cobalt Chrome',
    'Copper Alloy',
    'Ductile Iron',
    'Iron Alloy',
    'Iron Cobalt Vanadium',
    'Manganese Bronze',
    'Maraging Steel',
    'Molybdenum Alloy',
    'Nickel Alloy',
    'Nickel Chrome Moly',
    'Nickel Iron Alloy',
    'Nickel Iron Molybdenum',
    'Ni-Cr-Mo Steel',
    'Plastics',
    'Silicon Bronze',
    'Silicon Iron',
    'Spring Steel',
    'Stainless Steel',
    'Stellite',
    'Structural Steel',
    'Titanium',
    'Tool Steel'
  ],
  'Wire': [
    'Alloy Steel',
    'Aluminum Alloy',
    'Carbon Steel',
    'Stainless Steel',
    'Titanium'
  ],
  'Hex Bar': [
    'Alloy Steel',
    'Aluminum Alloy',
    'Carbon Steel',
    'Stainless Steel',
    'Titanium'
  ],
  'Block': [
    'Alloy Steel',
    'Aluminum Alloy',
    'Titanium'
  ],
  'Plate': [
    'Alloy Steel',
    'Aluminum Alloy',
    'Stainless Steel',
    'Titanium'
  ],
  'Rectangular Bar': [
    'Alloy Steel',
    'Aluminum Alloy',
    'Stainless Steel'
  ],
  'Sheet': [
    'Aluminum Alloy',
    'Stainless Steel',
    'Titanium'
  ],
  'Hollow Bar': [
    'Alloy Steel',
    'Stainless Steel'
  ],
  'Seamless Pipe': [
    'Alloy Steel',
    'Stainless Steel',
    'Titanium'
  ],
  'Welded Pipe': [
    'Stainless Steel'
  ],
  'Seamless Tube': [
    'Alloy Steel',
    'Stainless Steel',
    'Titanium'
  ],
  'Welded Tube': [
    'Stainless Steel'
  ]
};

export const grades = {
  'Alloy Steel': [
    '4137', '4140', '4142', '4150', '4330', '4340', '4715', '4815', '6150', '6304',
    '8620', '8720', '8740', '9310', '9313', '135M', '17-22A', '3%CrMo S106', '300M',
    '4330M', '4340M', 'AERMET 100', 'AERMET10', 'BG42', 'ETD150', 'MP159', '15CDV6',
    '16NCD13', '35NC6', '35NCD16', 'E16NCD13', 'E32CDV13', 'EZ6NCT25'
  ],
  'Aluminum Alloy': [
    '1100', '1145', '2014', '2017', '2024', '2219', '4032', '5052', '6061', '6063',
    '7050', '7075', '7085'
  ],
  'Carbon Steel': [
    '1018', '1026', '1045', '1117', '1137', '1144', '1213', '1215', '11L17', '12L14',
    'CMI', 'Grade 70', 'H-11'
  ],
  'Stainless Steel': [
    '21-6-9', '303SE', '418 Greek Ascoloy', '440A', 'Nimonic 90', 'Type 108', 'Type 13-8',
    'Type 15-5', 'Type 17-4', 'Type 17-4PH', 'Type 17-7', 'Type 301', 'Type 302', 'Type 303',
    'Type 303SE', 'Type 304', 'Type 304L', 'Type 310', 'Type 316', 'Type 316L', 'Type 316LVM',
    'Type 321', 'Type 347', 'Type 355', 'Type 403', 'Type 410', 'Type 416', 'Type 420',
    'Type 430', 'Type 431', 'Type 440', 'Type 440C', 'Type 455', 'Type 465', 'Type A286',
    'Type S240', 'XD15NW', 'Z10CNT18-11', 'Z15CN17-03', 'Z6CNT18-10', 'Z7CNU17-04',
    'MARVLAX12', '455', '465', 'MarVLAX12H', 'Z3CN18'
  ],
  'Titanium': [
    '100A CP', '6 Al - 4 V', '6 Al - 4 V ELI (Medical)', '6Al - 2SN - 4Zr - 2Mo',
    '6Al - 2SN - 4Zr - 6Mo', '6Al - 6V - 2Sn', '7AL - 4Mo', 'Grade 1 CP', 'Grade 17',
    'Grade 2 CP', 'Grade 2 CP Aerospace', 'Grade 3 CP', 'Grade 3 CP Aerospace', 'Grade 4 CP',
    'Grade 4 CP Aerospace', 'Grade 70', 'Ti 10V-2Fe-3Al', 'TI 3Al-2.5V', 'Ti Gr 4 CP 70'
  ]
};
// constants.js
export const DENSITIES = {
  'Alloy Steel': 0.284,
  'Aluminum Alloy': 0.098,
  'Carbon Steel': 0.284,
  'Cobalt Chrome': 0.318,
  'Copper Alloy': 0.323,
  'Ductile Iron': 0.260,
  'Iron Alloy': 0.284,
  'Iron Cobalt Vanadium': 0.302,
  'Manganese Bronze': 0.308,
  'Maraging Steel': 0.289,
  'Molybdenum Alloy': 0.369,
  'Nickel Alloy': 0.308,
  'Nickel Chrome Moly': 0.308,
  'Nickel Iron Alloy': 0.300,
  'Nickel Iron Molybdenum': 0.300,
  'Ni-Cr-Mo Steel': 0.284,
  'Plastics': 0.047,
  'Silicon Bronze': 0.318,
  'Silicon Iron': 0.260,
  'Spring Steel': 0.284,
  'Stainless Steel': 0.290,
  'Stellite': 0.318,
  'Structural Steel': 0.284,
  'Titanium': 0.163,
  'Tool Steel': 0.284
};

// 1 lb/in³ = 2.76799e-5 kg/mm³
export const LB_TO_KG = 0.453592;
export const INCH_TO_MM = 25.4;
export const LB_FT_TO_KG_M = 1.4878;


export const tolerances = [
  { value: 'with', label: 'With Tolerances' },
  { value: 'without', label: 'Without Tolerances' }
];

export const units = [
  { value: 'in', label: 'inches', inchVal: 1 },
  { value: 'ft', label: 'feet', inchVal: 0.0833 },
  { value: 'mm', label: 'millimeters', inchVal: 25.4 },
  { value: 'm', label: 'meters', inchVal: 0.0254 }
];

export const dimensionTolerances = {
  'Round Bar': {
    diameter: { value: 0.002, unit: 'in' },
    length: { value: 0.078, unit: 'in' }
  }
};