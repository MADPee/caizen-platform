
import { Fuel, Clock, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FuelIndicatorProps {
  lastFuelDate: string;
  nextServiceKm: number;
  fuelConsumption: number;
  className?: string;
}

export function FuelIndicator({ lastFuelDate, nextServiceKm, fuelConsumption, className }: FuelIndicatorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-xs">
        <Fuel className="w-3 h-3 text-automotive-blue" />
        <span className="text-automotive-silver">Senaste tankning:</span>
        <Badge variant="secondary" className="bg-automotive-blue/20 text-automotive-blue text-xs">
          {lastFuelDate}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        <Clock className="w-3 h-3 text-automotive-orange" />
        <span className="text-automotive-silver">Nästa service:</span>
        <Badge variant="secondary" className="bg-automotive-orange/20 text-automotive-orange text-xs">
          {nextServiceKm} km
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        <TrendingDown className="w-3 h-3 text-green-500" />
        <span className="text-automotive-silver">Förbrukning:</span>
        <Badge variant="secondary" className="bg-green-500/20 text-green-500 text-xs">
          {fuelConsumption} l/100km
        </Badge>
      </div>
    </div>
  );
}
