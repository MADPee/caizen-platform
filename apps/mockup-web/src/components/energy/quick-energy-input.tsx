
import { useState } from "react";
import { Droplet, MapPin, Zap, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VehicleSelector } from "./vehicle-selector";
import { EnergyInputModal } from "./energy-input-modal";
import { useToast } from "@/hooks/use-toast";

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

export function QuickEnergyInput() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const { toast } = useToast();
  
  // Placeholder – kommer från backend när kopplat
  const userVehicles: Vehicle[] = [];

  // Auto-select first vehicle if none selected
  if (!selectedVehicleId && userVehicles.length > 0) {
    setSelectedVehicleId(userVehicles[0].id);
  }

  const selectedVehicle = userVehicles.find(v => v.id === selectedVehicleId);

  const getEnergyIcon = () => {
    if (!selectedVehicle) return <Car size={20} className="mr-2" />;
    
    switch (selectedVehicle.fuelType) {
      case 'electric':
        return <Zap size={20} className="mr-2" />;
      case 'hybrid':
        return <div className="flex mr-2"><Droplet size={16} /><Zap size={16} /></div>;
      default:
        return <Droplet size={20} className="mr-2" />;
    }
  };

  const getButtonText = () => {
    if (!selectedVehicle) return 'Välj fordon först';
    
    switch (selectedVehicle.fuelType) {
      case 'electric':
        return 'Lägg till Laddning';
      case 'hybrid':
        return 'Lägg till Tankning/Laddning';
      default:
        return 'Lägg till Tankning';
    }
  };

  const handleEnergyEntryAdded = (entry: any) => {
    setIsModalOpen(false);
    toast({
      title: "Energipost tillagd",
      description: `${selectedVehicle?.name}: ${entry.calculatedConsumption} ${selectedVehicle?.unit}`,
    });
  };

  return (
    <Card className="bg-automotive-darker border-automotive-orange/20 mb-6">
      <CardContent className="p-4">
        {userVehicles.length > 0 ? (
          <VehicleSelector 
            vehicles={userVehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleChange={setSelectedVehicleId}
          />
        ) : (
          <div className="text-center text-automotive-silver py-6">
            Inga registrerade fordon ännu.
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-automotive-orange hover:bg-automotive-orange/80 text-white py-3 px-6 font-semibold h-auto"
              disabled={!selectedVehicle}
            >
              {getEnergyIcon()}
              {getButtonText()}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-white">
                <Car className="mr-2 text-automotive-orange" size={20} />
                {getButtonText()} - {selectedVehicle?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedVehicle && (
              <EnergyInputModal 
                vehicle={selectedVehicle}
                onEntryAdded={handleEnergyEntryAdded}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {selectedVehicle && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <span className="text-xs text-automotive-silver">Senaste förbrukning</span>
              <p className="font-mono text-lg text-automotive-orange">
                {selectedVehicle.lastConsumption || '--'} {selectedVehicle.unit}
              </p>
            </div>
            <div className="text-center">
              <span className="text-xs text-automotive-silver">Medianförbrukning</span>
              <p className="font-mono text-lg text-white">
                {selectedVehicle.medianConsumption || '--'} {selectedVehicle.unit}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-center text-xs text-automotive-silver">
          <MapPin size={12} className="mr-1" />
          <span>GPS-detektering aktiverad för smart stationsförslag</span>
        </div>
      </CardContent>
    </Card>
  );
}
