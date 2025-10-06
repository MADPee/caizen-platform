
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SecurityBadge } from "@/components/ui/security-badge";
import { Search, Filter, Plus, Fuel, TrendingUp, Settings, BarChart3, Eye } from "lucide-react";
import FuelManagementDashboardV2 from "@/components/fuel/fuel-management-dashboard";

export function EnergyAnalysisDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("overview"); // "overview" eller "detailed"
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Samma fordonsdata som i VehiclesSection men med utökad energidata
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
      energyData: {
        lastRefuel: "2 dagar sedan",
        nextServiceKm: 1200,
        consumption: 7.2,
        fuelType: "Bensin 95",
        totalDistance: 15420,
        avgConsumption: 7.5,
        co2Emissions: 168
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
      energyData: {
        lastRefuel: "1 dag sedan",
        nextServiceKm: 850,
        consumption: 8.5,
        fuelType: "Diesel",
        totalDistance: 22100,
        avgConsumption: 8.8,
        co2Emissions: 142
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
      energyData: {
        lastRefuel: "1 vecka sedan",
        nextServiceKm: 2500,
        consumption: 10.1,
        fuelType: "Bensin 98",
        totalDistance: 8920,
        avgConsumption: 10.3,
        co2Emissions: 234
      }
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Om vi är i detaljvy, visa den avancerade energianalysen
  if (activeView === "detailed") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setActiveView("overview")}
              className="border-automotive-blue/50 text-automotive-blue hover:bg-automotive-blue/10"
            >
              ← Tillbaka till översikt
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-white">Detaljerad Energianalys</h2>
              {selectedVehicle && (
                <p className="text-automotive-silver">
                  {vehicles.find(v => v.id === selectedVehicle)?.name}
                </p>
              )}
            </div>
          </div>
        </div>
        <FuelManagementDashboardV2 />
      </div>
    );
  }

  // Annars visa översiktsvyn
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Energianalys</h2>
          <p className="text-automotive-silver">
            Översikt av energiförbrukning och miljöpåverkan för dina fordon
          </p>
        </div>
        <Button className="bg-automotive-orange hover:bg-automotive-orange/80">
          <Plus className="w-4 h-4 mr-2" />
          Lägg till Tankning
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
          <Card key={vehicle.id} className="bg-automotive-darker border-automotive-blue/20 hover:border-automotive-blue/40 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="gauge-border w-12 h-12">
                    <div className="gauge-inner flex items-center justify-center">
                      <Fuel className="w-6 h-6 text-automotive-blue" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{vehicle.name}</CardTitle>
                    <p className="text-sm text-automotive-silver">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <SecurityBadge level="encrypted" showLabel={false} />
                  {vehicle.verificationStatus && (
                    <SecurityBadge level="verified" showLabel={false} />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-automotive-silver">Reg.nr:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white">{vehicle.registrationMasked}</span>
                    <SecurityBadge level="masked" showLabel={false} />
                  </div>
                </div>
                <div>
                  <span className="text-automotive-silver">VIN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white">{vehicle.vinMasked}</span>
                    <SecurityBadge level="masked" showLabel={false} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-automotive-blue/20 text-automotive-blue">
                  {vehicle.color}
                </Badge>
                {vehicle.verificationStatus ? (
                  <Badge className="bg-green-500/20 text-green-500">
                    Verifierad hos Transportstyrelsen
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-automotive-orange text-automotive-orange">
                    Avvaktar verifiering
                  </Badge>
                )}
              </div>

              {/* Energidata */}
              <div className="border-t border-automotive-blue/20 pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-automotive-silver">Senaste tankning:</span>
                    <p className="text-automotive-blue font-medium">{vehicle.energyData.lastRefuel}</p>
                  </div>
                  <div>
                    <span className="text-automotive-silver">Nästa service:</span>
                    <p className="text-automotive-orange font-medium">{vehicle.energyData.nextServiceKm} km</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-automotive-silver">Förbrukning:</span>
                    <p className="text-green-500 font-medium">{vehicle.energyData.consumption} l/100km</p>
                  </div>
                  <div>
                    <span className="text-automotive-silver">Bränsletyp:</span>
                    <p className="text-white font-medium">{vehicle.energyData.fuelType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-automotive-silver">Total sträcka:</span>
                    <p className="text-white font-medium">{vehicle.energyData.totalDistance.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-automotive-silver">CO₂ utsläpp:</span>
                    <p className="text-red-400 font-medium">{vehicle.energyData.co2Emissions} g/km</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-automotive-blue/50 text-automotive-blue hover:bg-automotive-blue/10"
                  onClick={() => {
                    setSelectedVehicle(vehicle.id);
                    setActiveView("detailed");
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Detaljanalys
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-automotive-orange hover:bg-automotive-orange/80"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Hantera
                </Button>
              </div>
            </CardContent>
          </Card>
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
