
import { useState } from "react";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";

export function VehiclesSection() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from secure database
  const vehicles = [
    {
      id: "1",
      name: "Min BMW",
      make: "BMW",
      model: "M3",
      year: 2023,
      color: "Alpine White",
      registrationMasked: "ABC***",
      vinMasked: "WBA***********1234",
      verificationStatus: true,
      lastVerifiedAt: "2024-01-15",
      fuelData: {
        lastFuelDate: "2 dagar sedan",
        nextServiceKm: 1200,
        fuelConsumption: 7.2
      }
    },
    {
      id: "2", 
      name: "Familje-Volvo",
      make: "Volvo",
      model: "XC90",
      year: 2022,
      color: "Crystal White",
      registrationMasked: "XYZ***",
      vinMasked: "YV1***********5678",
      verificationStatus: true,
      lastVerifiedAt: "2024-01-10",
      fuelData: {
        lastFuelDate: "1 dag sedan",
        nextServiceKm: 850,
        fuelConsumption: 8.5
      }
    },
    {
      id: "3",
      name: "Sommarbil",
      make: "Porsche",
      model: "911",
      year: 2021,
      color: "Guards Red",
      registrationMasked: "POR***",
      vinMasked: "WP0***********9012",
      verificationStatus: false,
      fuelData: {
        lastFuelDate: "1 vecka sedan",
        nextServiceKm: 2500,
        fuelConsumption: 10.1
      }
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Mina Fordon</h2>
          <p className="text-automotive-silver">
            Hantera dina fordon med militärgrad datasäkerhet
          </p>
        </div>
        <Button className="bg-automotive-orange hover:bg-automotive-orange/80">
          <Plus className="w-4 h-4 mr-2" />
          Lägg till Fordon
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-automotive-silver" />
          <Input
            placeholder="Sök fordon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-automotive-darker border-automotive-blue/20 text-white placeholder-automotive-silver"
          />
        </div>
        <Button 
          variant="outline" 
          className="border-automotive-blue/50 text-automotive-blue hover:bg-automotive-blue/10"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onViewDetails={(id) => console.log("View details for:", id)}
            onManage={(id) => console.log("Manage vehicle:", id)}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 gauge-border">
            <div className="gauge-inner flex items-center justify-center">
              <Search className="w-12 h-12 text-automotive-silver" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Inga fordon hittades</h3>
          <p className="text-automotive-silver">
            Prova att justera dina sökfilter eller lägg till ett nytt fordon.
          </p>
        </div>
      )}
    </div>
  );
}
