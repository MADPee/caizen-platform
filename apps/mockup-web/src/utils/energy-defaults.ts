
interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  registrationMasked: string;
  lastConsumption?: number;
  medianConsumption?: number;
  unit: 'l/100km' | 'kWh/100km';
}

export function getSmartDefaults(vehicle: Vehicle, previousOdometer: number) {
  const estimatedDistance = Math.floor(Math.random() * 150) + 50; // 50-200km
  const estimatedOdometer = previousOdometer + estimatedDistance;
  
  // Smart amount defaults based on vehicle type and distance
  let estimatedAmount: number;
  let estimatedCost: number;
  
  if (vehicle.fuelType === 'electric') {
    // Electric: 15-20 kWh/100km average
    estimatedAmount = Math.round((estimatedDistance * 17 / 100) * 10) / 10;
    estimatedCost = Math.round(estimatedAmount * 2.8); // ~2.80 SEK/kWh
  } else {
    // Fuel: Use median consumption or default to 7 l/100km
    const consumption = vehicle.medianConsumption || 7;
    estimatedAmount = Math.round((estimatedDistance * consumption / 100) * 10) / 10;
    
    const pricePerLiter = vehicle.fuelType === 'diesel' ? 17.50 : 18.20;
    estimatedCost = Math.round(estimatedAmount * pricePerLiter);
  }

  return {
    estimatedOdometer: estimatedOdometer.toString(),
    estimatedAmount: estimatedAmount.toString(),
    estimatedCost: estimatedCost.toString()
  };
}

export function getValidationLimits(fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid') {
  if (fuelType === 'electric') {
    return { 
      minAmount: 5, 
      maxAmount: 100, 
      minCost: 50, 
      maxCost: 1500,
      expectedRange: '5-100 kWh'
    };
  }
  return { 
    minAmount: 5, 
    maxAmount: 150, 
    minCost: 50, 
    maxCost: 3000,
    expectedRange: '5-150 liter'
  };
}
