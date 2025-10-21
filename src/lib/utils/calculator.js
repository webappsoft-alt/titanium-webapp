import { metalFamilies } from './constants';

export function calculateVolume(productForm, dimensions) {
  switch (productForm) {
    case 'Round Bar':
      return Math.PI * Math.pow(dimensions.diameter / 2, 2) * dimensions.length;
    
    case 'Wire':
      return Math.PI * Math.pow(dimensions.diameter / 2, 2) * dimensions.length;
    
    case 'Hex Bar': {
      const across = dimensions['across-flats'];
      return (2 * Math.sqrt(3) * Math.pow(across, 2) * dimensions.length) / 4;
    }
    
    case 'Block':
    case 'Plate':
    case 'Sheet':
      return dimensions.width * dimensions.height * dimensions.length;
    
    case 'Pipe':
    case 'Tube': {
      const outerRadius = dimensions['outer-diameter'] / 2;
      const innerRadius = outerRadius - dimensions['wall-thickness'];
      return Math.PI * dimensions.length * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));
    }
    
    default:
      return 0;
  }
}

export function calculateWeight(productForm, metalFamily, dimensions, quantity = 1, withTolerance = false) {
  const volume = calculateVolume(productForm, dimensions);
  const density = metalFamilies[metalFamily]?.density || 0;
  
  let weight = volume * density;
  
  // Add 5% for tolerance if requested
  if (withTolerance) {
    weight *= 1.05;
  }
  
  const totalWeight = weight * quantity;
  
  return {
    pieceWeight: {
      lbs: Number(weight).toFixed(4),
      kg: Number(weight * 0.453592).toFixed(4)
    },
    totalWeight: {
      lbs: Number(totalWeight).toFixed(4),
      kg: Number(totalWeight * 0.453592).toFixed(4)
    },
    volume: Number(volume).toFixed(4)
  };
}