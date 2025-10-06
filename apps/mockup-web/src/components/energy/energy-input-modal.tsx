
import { useState, useEffect } from "react";
import { Droplet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StationDetector } from "./station-detector";
import { ConsumptionCalculator } from "./consumption-calculator";
import { getSmartDefaults, getValidationLimits } from "@/utils/energy-defaults";

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

interface EnergyInputModalProps {
  vehicle: Vehicle;
  onEntryAdded: (entry: EnergyEntry) => void;
}

interface EnergyEntry {
  vehicleId: string;
  date: Date;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  amount: number;
  cost: number;
  pricePerUnit: number;
  odometerReading: number;
  stationName?: string;
  gpsLocation?: { lat: number; lng: number };
  calculatedConsumption?: number;
}

export function EnergyInputModal({ vehicle, onEntryAdded }: EnergyInputModalProps) {
  const previousOdometer = 165618; // Mock data - would come from vehicle history
  const smartDefaults = getSmartDefaults(vehicle, previousOdometer);
  
  const [formData, setFormData] = useState({
    amount: smartDefaults.estimatedAmount,
    cost: smartDefaults.estimatedCost,
    odometerReading: smartDefaults.estimatedOdometer,
    stationName: ''
  });

  const getUnit = () => {
    return vehicle.fuelType === 'electric' ? 'kWh' : 'liter';
  };

  const calculateConsumption = () => {
    const amount = parseFloat(formData.amount);
    const odometer = parseInt(formData.odometerReading);
    
    if (amount && odometer && odometer > previousOdometer) {
      const distance = odometer - previousOdometer;
      const consumption = (amount / distance) * 100;
      return consumption.toFixed(1);
    }
    return null;
  };

  const calculatePricePerUnit = () => {
    const amount = parseFloat(formData.amount);
    const cost = parseFloat(formData.cost);
    
    if (amount && cost) {
      return (cost / amount).toFixed(2);
    }
    return null;
  };

  const isFormValid = () => {
    const limits = getValidationLimits(vehicle.fuelType);
    const amount = parseFloat(formData.amount);
    const cost = parseFloat(formData.cost);
    const odometer = parseInt(formData.odometerReading);
    
    return amount >= limits.minAmount && 
           amount <= limits.maxAmount &&
           cost >= limits.minCost && 
           cost <= limits.maxCost &&
           odometer > previousOdometer;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    const entry: EnergyEntry = {
      vehicleId: vehicle.id,
      date: new Date(),
      fuelType: vehicle.fuelType,
      amount: parseFloat(formData.amount),
      cost: parseFloat(formData.cost),
      pricePerUnit: parseFloat(calculatePricePerUnit() || '0'),
      odometerReading: parseInt(formData.odometerReading),
      stationName: formData.stationName || undefined,
      calculatedConsumption: parseFloat(calculateConsumption() || '0')
    };
    
    onEntryAdded(entry);
  };

  const validationLimits = getValidationLimits(vehicle.fuelType);

  return (
    <div className="space-y-4">
      {/* Vehicle Info */}
      <div className="bg-automotive-blue/10 p-3 rounded-lg border border-automotive-blue/20">
        <div className="flex items-center text-automotive-blue">
          {vehicle.fuelType === 'electric' ? (
            <Zap size={16} className="mr-2" />
          ) : vehicle.fuelType === 'hybrid' ? (
            <div className="flex mr-2">
              <Droplet size={12} />
              <Zap size={12} />
            </div>
          ) : (
            <Droplet size={16} className="mr-2" />
          )}
          <span className="text-sm font-medium">
            {vehicle.name} ({vehicle.registrationMasked}) - {vehicle.fuelType === 'electric' ? 'Elbil' : vehicle.fuelType === 'hybrid' ? 'Hybrid' : 'Bensin/Diesel'}
          </span>
        </div>
      </div>

      <StationDetector 
        vehicleFuelType={vehicle.fuelType}
        stationName={formData.stationName}
        onStationChange={(station) => setFormData(prev => ({ ...prev, stationName: station }))}
      />

      {/* Energy Input */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-automotive-silver">Mängd ({getUnit()})</Label>
          <Input 
            type="number"
            placeholder={validationLimits.expectedRange}
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="bg-automotive-darker border-automotive-blue/20"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-automotive-silver">Kostnad (SEK)</Label>
          <Input 
            type="number"
            placeholder="Auto-beräknat"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
            className="bg-automotive-darker border-automotive-blue/20"
          />
        </div>
      </div>

      {/* Odometer */}
      <div className="space-y-2">
        <Label className="text-automotive-silver">
          Mätarställning (km) - Förra: {previousOdometer.toLocaleString()}
        </Label>
        <Input 
          type="number"
          placeholder="Auto-uppskattad"
          value={formData.odometerReading}
          onChange={(e) => setFormData(prev => ({ ...prev, odometerReading: e.target.value }))}
          className="bg-automotive-darker border-automotive-blue/20"
        />
      </div>

      <ConsumptionCalculator 
        amount={formData.amount}
        cost={formData.cost}
        odometerReading={formData.odometerReading}
        previousOdometer={previousOdometer}
        unit={vehicle.unit}
        fuelType={vehicle.fuelType}
      />

      {/* Submit */}
      <Button 
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className="w-full bg-automotive-orange hover:bg-automotive-orange/80 disabled:bg-gray-600"
      >
        {vehicle.fuelType === 'electric' ? (
          <><Zap size={16} className="mr-2" />Spara Laddning</>
        ) : (
          <><Droplet size={16} className="mr-2" />Spara Tankning</>
        )}
      </Button>
    </div>
  );
}
