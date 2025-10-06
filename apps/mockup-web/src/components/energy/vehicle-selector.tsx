
import { Car, Droplet, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
}

export function VehicleSelector({ vehicles, selectedVehicleId, onVehicleChange }: VehicleSelectorProps) {
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'electric':
        return <Zap size={16} className="mr-2 text-blue-500" />;
      case 'hybrid':
        return (
          <div className="flex mr-2">
            <Droplet size={12} className="text-orange-500" />
            <Zap size={12} className="text-blue-500" />
          </div>
        );
      default:
        return <Droplet size={16} className="mr-2 text-orange-500" />;
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-automotive-orange/10 p-4 rounded-lg border border-automotive-orange/20 mb-4">
        <div className="flex items-center text-automotive-orange">
          <Car size={16} className="mr-2" />
          <span className="text-sm">Lägg till fordon först för att registrera energianvändning</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="text-sm text-automotive-silver mb-2 block">Välj fordon</label>
      <Select value={selectedVehicleId} onValueChange={onVehicleChange}>
        <SelectTrigger className="bg-automotive-darker border-automotive-blue/20">
          <SelectValue placeholder="Välj fordon för energiinmatning...">
            {selectedVehicle && (
              <div className="flex items-center">
                <Car size={16} className="mr-2 text-automotive-blue" />
                <span>{selectedVehicle.name}</span>
                <span className="text-automotive-silver ml-2">({selectedVehicle.registrationMasked})</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {vehicles.map(vehicle => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              <div className="flex items-center">
                {getFuelIcon(vehicle.fuelType)}
                <div>
                  <div className="font-medium">{vehicle.name}</div>
                  <div className="text-xs text-gray-400">{vehicle.registrationMasked}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
