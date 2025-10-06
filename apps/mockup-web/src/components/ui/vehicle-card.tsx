
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityBadge } from "@/components/ui/security-badge";
import { FuelIndicator } from "@/components/ui/fuel-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Settings, TrendingUp } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    make: string;
    model: string;
    year: number;
    color: string;
    registrationMasked: string;
    vinMasked: string;
    verificationStatus: boolean;
    lastVerifiedAt?: string;
    fuelData?: {
      lastFuelDate: string;
      nextServiceKm: number;
      fuelConsumption: number;
    };
  };
  onViewDetails?: (vehicleId: string) => void;
  onManage?: (vehicleId: string) => void;
}

export function VehicleCard({ vehicle, onViewDetails, onManage }: VehicleCardProps) {
  return (
    <Card className="bg-automotive-darker border-automotive-blue/20 hover:border-automotive-blue/40 transition-all duration-300 security-indicator">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="gauge-border w-12 h-12">
              <div className="gauge-inner flex items-center justify-center">
                <Car className="w-6 h-6 text-automotive-blue" />
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

        {vehicle.fuelData && (
          <div className="border-t border-automotive-blue/20 pt-3">
            <FuelIndicator
              lastFuelDate={vehicle.fuelData.lastFuelDate}
              nextServiceKm={vehicle.fuelData.nextServiceKm}
              fuelConsumption={vehicle.fuelData.fuelConsumption}
            />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-automotive-blue/50 text-automotive-blue hover:bg-automotive-blue/10"
            onClick={() => onViewDetails?.(vehicle.id)}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistik
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-automotive-orange hover:bg-automotive-orange/80"
            onClick={() => onManage?.(vehicle.id)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Hantera
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
