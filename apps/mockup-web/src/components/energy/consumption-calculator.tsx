
import { Calculator } from "lucide-react";

interface ConsumptionCalculatorProps {
  amount: string;
  cost: string;
  odometerReading: string;
  previousOdometer: number;
  unit: 'l/100km' | 'kWh/100km';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
}

export function ConsumptionCalculator({ 
  amount, 
  cost, 
  odometerReading, 
  previousOdometer, 
  unit,
  fuelType 
}: ConsumptionCalculatorProps) {
  const getEnergyUnit = () => {
    return fuelType === 'electric' ? 'kWh' : 'liter';
  };

  const calculatePricePerUnit = () => {
    const amountNum = parseFloat(amount);
    const costNum = parseFloat(cost);
    
    if (amountNum && costNum) {
      return (costNum / amountNum).toFixed(2);
    }
    return null;
  };

  const calculateConsumption = () => {
    const amountNum = parseFloat(amount);
    const odometer = parseInt(odometerReading);
    
    if (amountNum && odometer && odometer > previousOdometer) {
      const distance = odometer - previousOdometer;
      const consumption = (amountNum / distance) * 100;
      return consumption.toFixed(1);
    }
    return null;
  };

  const pricePerUnit = calculatePricePerUnit();
  const consumption = calculateConsumption();

  return (
    <div className="space-y-3">
      {pricePerUnit && (
        <div className="bg-automotive-blue/10 p-3 rounded-lg border border-automotive-blue/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-automotive-silver">Pris per {getEnergyUnit()}:</span>
            <span className="font-mono text-automotive-blue">{pricePerUnit} SEK</span>
          </div>
        </div>
      )}

      {consumption && (
        <div className="bg-automotive-orange/10 p-3 rounded-lg border border-automotive-orange/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator size={16} className="mr-2 text-automotive-orange" />
              <span className="text-sm text-automotive-silver">Beräknad förbrukning:</span>
            </div>
            <span className="font-mono text-lg text-automotive-orange">
              {consumption} {unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
