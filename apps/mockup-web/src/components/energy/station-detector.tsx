
import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecentStation {
  id: string;
  name: string;
  lastUsed: Date;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
}

interface StationDetectorProps {
  vehicleFuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  stationName: string;
  onStationChange: (station: string) => void;
}

export function StationDetector({ vehicleFuelType, stationName, onStationChange }: StationDetectorProps) {
  const [detectedStation, setDetectedStation] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const recentStations: RecentStation[] = [
    { id: '1', name: 'Preem Haninge', lastUsed: new Date('2025-05-20'), fuelType: 'gasoline' },
    { id: '2', name: 'Circle K Södertälje', lastUsed: new Date('2025-05-15'), fuelType: 'gasoline' },
    { id: '3', name: 'Shell Vällingby', lastUsed: new Date('2025-05-10'), fuelType: 'diesel' },
    { id: '4', name: 'Tesla Supercharger Arlanda', lastUsed: new Date('2025-05-18'), fuelType: 'electric' },
    { id: '5', name: 'Ionity Laddstation Västerås', lastUsed: new Date('2025-05-12'), fuelType: 'electric' },
  ];

  const filteredStations = recentStations.filter(station => {
    if (vehicleFuelType === 'hybrid') return true;
    return station.fuelType === vehicleFuelType;
  });

  useEffect(() => {
    setIsDetecting(true);
    setTimeout(() => {
      if (vehicleFuelType === 'electric') {
        setDetectedStation('Tesla Supercharger Haninge Centrum');
      } else {
        setDetectedStation('Preem Haninge Centrum');
      }
      setIsDetecting(false);
    }, 2000);
  }, [vehicleFuelType]);

  const useDetectedStation = () => {
    if (detectedStation) {
      onStationChange(detectedStation);
    }
  };

  const getStationTypeText = () => {
    return vehicleFuelType === 'electric' ? 'laddstationer' : 'bensinstationer';
  };

  const getStationPlaceholder = () => {
    return vehicleFuelType === 'electric' ? 'laddstation' : 'bensinstation';
  };

  return (
    <div className="space-y-4">
      {/* GPS Detection */}
      {isDetecting && (
        <div className="bg-automotive-blue/10 p-3 rounded-lg border border-automotive-blue/20">
          <div className="flex items-center text-automotive-blue">
            <MapPin size={16} className="mr-2 animate-pulse" />
            <span className="text-sm">Söker närliggande {getStationTypeText()}...</span>
          </div>
        </div>
      )}
      
      {detectedStation && !stationName && (
        <Button 
          onClick={useDetectedStation}
          className="w-full bg-green-600 hover:bg-green-700 p-3 text-left justify-start"
        >
          <MapPin size={16} className="mr-2" />
          Använd: {detectedStation}
        </Button>
      )}

      {/* Station Selection */}
      <div className="space-y-2">
        <Label className="text-automotive-silver">Välj station</Label>
        <Select value={stationName} onValueChange={onStationChange}>
          <SelectTrigger className="bg-automotive-darker border-automotive-blue/20">
            <SelectValue placeholder={`Välj tidigare ${getStationPlaceholder()}...`} />
          </SelectTrigger>
          <SelectContent>
            {filteredStations.map(station => (
              <SelectItem key={station.id} value={station.name}>
                <div className="flex items-center justify-between w-full">
                  <span>{station.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    <Clock size={12} className="inline mr-1" />
                    {station.lastUsed.toLocaleDateString()}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input 
          placeholder={`Eller skriv ${getStationPlaceholder()}namn...`}
          value={stationName}
          onChange={(e) => onStationChange(e.target.value)}
          className="bg-automotive-darker border-automotive-blue/20"
        />
      </div>
    </div>
  );
}
