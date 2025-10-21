import { DENSITIES, LB_TO_KG, INCH_TO_MM, LB_FT_TO_KG_M } from './constants';

export function calculateVolume(productForm, dimensions) {

  switch (productForm) {
    case 'Round Bar':
      return Math.PI * Math.pow(dimensions.diameter?.value / 2, 2) * dimensions.length?.value;

    case 'Wire':
      return Math.PI * Math.pow(dimensions.diameter?.value / 2, 2) * dimensions.length?.value;

    case 'Hex Bar':
      return (2 * Math.sqrt(3) * Math.pow(dimensions['across-flats'], 2) * dimensions.length?.value) / 4;

    case 'Block':
      return dimensions.width * dimensions.height * dimensions.length?.value;

    case 'Plate':
      return dimensions.thickness * dimensions.width * dimensions.length?.value;

    case 'Rectangular Bar':
      return dimensions.width * dimensions.height * dimensions.length?.value;

    case 'Sheet':
      return dimensions.thickness * dimensions.width * dimensions.length?.value;

    case 'Hollow Bar':
    case 'Seamless Pipe':
    case 'Welded Pipe':
    case 'Seamless Tube':
    case 'Welded Tube': {
      const outerRadius = dimensions['outer-diameter'] / 2;
      const wallThickness = dimensions['wall-thickness'];
      const innerRadius = outerRadius - wallThickness;
      return Math.PI * dimensions.length?.value * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));
    }

    default:
      return 0;
  }
}
export function weightCalculatorFormula(productForm, values = { S3: 0, M3: 0, N3: 0, L: 0, LT: 0, O3: 0, P3: 0 }) {
  const {
    S3 = 0,
    M3 = 0,
    N3 = 0,
    L = 0,
    LT = 0,
    O3 = 0,
    P3 = 0,
  } = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, isNaN(Number(v)) || v === "" ? 0 : Number(v)])
  );
  switch (productForm) {
    case 'Round Bar':
    case 'Wire':
      return (Math.PI * S3 * Math.pow(M3 + N3, 2) * (L + LT)) / 4;

    case 'Hex Bar':
      return (L + LT) * Math.pow(M3 + N3, 2) * (Math.sqrt(3) * 0.5) * S3;

    case 'Block':
    case 'Plate':
    case 'Rectangular Bar':
    case 'Sheet':
      return S3 * (M3 + N3) * (O3 + P3) * (L + LT);

    case 'Hollow Bar':
      const avgOuter = (M3 + N3);
      const avgInner = (O3 - P3);
      const radius = (avgOuter - avgInner) / 2;
      const height = avgOuter - radius;
      return Math.PI * (L + LT) * S3 * radius * height;

    case 'Seamless Pipe':
    case 'Welded Pipe':
    case 'Seamless Tube':
    case 'Welded Tube':
      return Math.PI * (L + LT) * S3 * ((M3 + N3) - (O3 + P3)) * (O3 + P3);

    default:
      return 0;
  }
}


export function calculateWeight(productForm, metalFamily, dimensions, quantity = 1, withTolerance = false) {
  const volume = weightCalculatorFormula(productForm, { ...dimensions, LT: withTolerance ? dimensions?.LT || 0 : 0, N3: withTolerance ? dimensions?.N3 || 0 : 0 });
  const totalWeight = volume * quantity;
  return {
    pieceWeight: {
      lbs: Number(volume).toFixed(4),
      kg: Number(volume * LB_TO_KG).toFixed(4)
    },
    totalWeight: {
      lbs: Number(totalWeight).toFixed(4),
      kg: Number(totalWeight * LB_TO_KG).toFixed(4)
    },
    volume: Number(volume).toFixed(4)
  };
}

export function convertToInches(value, fromUnit) {
  switch (fromUnit) {
    case 'in': return value;
    case 'ft': return value * 12;
    case 'mm': return value / 25.4;
    case 'm': return value * 39.3701;
    default: return value;
  }
}
export const UomOptions = [{ value: 'lb', label: 'lb', newLabel: 'lb.' }, { value: 'inch', label: 'Inch', newLabel: 'Inch' }, { value: 'ft', label: 'Foot', newLabel: 'Feet' }]

export function splitFullName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return { fname: '', lname: '' };
  }

  const parts = fullName.trim().split(/\s+/); // split by any whitespace

  if (parts.length === 1) {
    return { fname: parts[0], lname: '' };
  }

  const fname = parts[0];
  const lname = parts.slice(1).join(' '); // join the rest as last name

  return { fname, lname };
}
/**
 * Calculates the cut formula based on product type and dimensions.
 *
 * @param {Object} params - Parameters object
 * @param {string} params.type - The product type (e.g. "Round Bar", "Hex Bar", etc.)
 * @param {number} params.M3 - Diameter, Thickness or OD (Column I)
 * @param {number} params.N3 - Primary Dim 1 Tolerance (Column J)
 * @param {number} [params.O3=0] - Width or Wall (Column K)
 * @param {number} [params.P3=0] - Secondary Dim 2 Tolerance (Column L)
 * 
 * Columns Reference:
 * S3 = Density (Column O) — Not used in volume formula directly but typically multiplied afterward.
 * M3 = Diameter / Thickness / OD (Column I)
 * N3 = Primary Dim 1 Tolerance (Column J)
 * O3 = Width or Wall (Column K)
 * P3 = Secondary Dim 2 Tolerance (Column L)
 * 
 * @returns {number} The computed volume/area value based on type and dimensions.
 */
export const customCutFormula = ({ type, M3, N3, O3 = 0, P3 = 0 }) => {
  const pi = Math.PI;
  const sqrt3 = Math.sqrt(3);

  const D1 = M3 + N3;
  const D2 = O3 + P3;
  const D3 = O3 - P3;
  console.table({ type, M3, N3, O3, P3 })
  switch (type.toLowerCase()) {
    case 'round bar':
      return (pi * Math.pow(D1, 2)) / 4;

    case 'hex bar':
      return Math.pow(D1, 2) * (sqrt3 * 0.5);

    case 'block':
    case 'plate':
    case 'rectangular bar':
    case 'sheet':
      console.log({ DDDVAL: D1 * D2 })
      return D1 * D2;

    case 'hollow bar':
      const r1 = D1 - D3;
      return pi * (r1 / 2) * (D1 - r1 / 2);

    case 'seamless pipe':
    case 'welded pipe':
    case 'seamless tube':
    case 'welded tube':
      return pi * (D1 - D2) * D2;

    default:
      return 0;
  }
};

export const getLogicValue = ({ M3, N3 }) => {
  const sum = M3 + N3;

  if (sum < 1) {
    return 0.031;
  } else if (sum >= 1 && sum < 3) {
    return 0.062;
  } else if (sum >= 3) {
    return 0.125;
  } else {
    return 0; // fallback in case of invalid input
  }
};


export function calculateWeightWithoutHTML({ productForm, dimensions, quantity = 1, withTolerance = false }) {
  // Calculate volume based on product form
  const volume = calculateVolumeWithoutHTML(productForm, dimensions, withTolerance);
  // console.table(dimensions)
  // Convert volume to weight using density
  // Assuming density is provided in kg/m³ and volume is in cubic units
  // Need to convert to consistent units first
  const totalWeight = volume * quantity;

  return {
    pieceWeight: {
      lbs: Number(volume).toFixed(4),
      kg: Number(volume * LB_TO_KG).toFixed(4)
    },
    totalWeight: {
      lbs: Number(totalWeight).toFixed(4),
      kg: Number(totalWeight * LB_TO_KG).toFixed(4)
    },
    volume: Number(volume).toFixed(4)
  };
}

/**
 * Calculates volume based on product form and dimensions
 * @param {string} productForm - Type of product
 * @param {object} dimensions - Dimensions object containing S3, M3, N3, L, LT, O3, P3
 * @param {boolean} withTolerance - Whether to apply tolerances
 * @returns {number} Volume in cubic units
 */
function calculateVolumeWithoutHTML(productForm, dimensions = {}, withTolerance = false) {
  // Extract and sanitize inputs
  const {
    S3 = 0,
    M3: rawM3 = 0,
    N3 = 0,
    L: rawL = 0,
    LT = 0,
    O3: rawO3 = 0,
    P3 = 0,
  } = Object.fromEntries(
    Object.entries(dimensions).map(([k, v]) => [k, isNaN(Number(v)) || v === "" ? 0 : Number(v)])
  );

  // Apply tolerances if enabled
  const M3 = withTolerance ? (rawM3 + (N3 || 0)) : rawM3;
  const L = withTolerance ? (rawL + (LT || 0)) : rawL;
  const O3 = withTolerance ? (rawO3 + (P3 || 0)) : rawO3;

  switch (productForm) {
    case 'Round Bar':
    case 'Wire':
      return (Math.PI * S3 * Math.pow(M3, 2) * L) / 4;

    case 'Hex Bar':
      return L * Math.pow(M3, 2) * (Math.sqrt(3) * 0.5) * S3;

    case 'Block':
    case 'Plate':
    case 'Rectangular Bar':
    case 'Sheet':
      return S3 * M3 * O3 * L;

    case 'Hollow Bar':
      const avgOuter = M3;
      const avgInner = withTolerance ? O3 : (rawO3 + P3);
      const radius = (avgOuter - avgInner) / 2;
      const height = avgOuter - radius;
      return Math.PI * L * S3 * radius * height;

    case 'Seamless Pipe':
    case 'Welded Pipe':
    case 'Seamless Tube':
    case 'Welded Tube':
      const wallThickness = withTolerance ?
        (M3 - O3) :
        ((rawM3 + N3) - (rawO3 + P3));
      return Math.PI * L * S3 * wallThickness * O3;

    default:
      console.warn(`Unknown product form: ${productForm}`);
      return 0;
  }
}

export function sortCustomValues(values) {
  // Patterns
  const diameterRegex = /^Ø\s?(\d+(\.\d+)?)"$/;
  const thicknessRegex = /^(\d+(\.\d+)?)"\s?thick$/i;
  const scheduleRegex = /^(\d+(\.\d+)?)"\s?SCH\/(\d+)$/i;

  // Detect which pattern applies
  const isDiameter = values.every(v => diameterRegex.test(v));
  const isThickness = values.every(v => thicknessRegex.test(v));
  const isSchedule = values.every(v => scheduleRegex.test(v));

  if (isDiameter) {
    return [...values].sort((a, b) => {
      const numA = parseFloat(a.match(diameterRegex)[1]);
      const numB = parseFloat(b.match(diameterRegex)[1]);
      return numA - numB;
    });
  }

  if (isThickness) {
    return [...values].sort((a, b) => {
      const numA = parseFloat(a.match(thicknessRegex)[1]);
      const numB = parseFloat(b.match(thicknessRegex)[1]);
      return numA - numB;
    });
  }

  if (isSchedule) {
    return [...values].sort((a, b) => {
      const [_, dimA, __, schA] = a.match(scheduleRegex);
      const [___, dimB, ____, schB] = b.match(scheduleRegex);
      const numDimA = parseFloat(dimA);
      const numDimB = parseFloat(dimB);
      if (numDimA === numDimB) {
        return parseInt(schA) - parseInt(schB);
      }
      return numDimA - numDimB;
    });
  }

  // No matching pattern → return as-is
  return values;
}
