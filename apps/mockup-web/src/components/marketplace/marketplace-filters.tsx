
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, MapPin, Filter } from "lucide-react";

interface MarketplaceFiltersProps {
  filters: {
    priceRange: number[];
    brand: string;
    radius: number;
    verificationStatus: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function MarketplaceFilters({ filters, onFiltersChange }: MarketplaceFiltersProps) {
  const brands = ["BMW", "Volvo", "Audi", "Mercedes-Benz", "Toyota", "Volkswagen"];
  
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-automotive-darker border-automotive-blue/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-automotive-blue" />
          Filter & Sök
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Prisintervall */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Prisintervall</label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value)}
            max={1000000}
            min={0}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-automotive-silver">
            <span>{filters.priceRange[0].toLocaleString()} kr</span>
            <span>{filters.priceRange[1].toLocaleString()} kr</span>
          </div>
        </div>

        {/* Märke */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Märke</label>
          <Select value={filters.brand} onValueChange={(value) => updateFilter("brand", value)}>
            <SelectTrigger className="bg-automotive-dark border-automotive-blue/20 text-white">
              <SelectValue placeholder="Välj märke" />
            </SelectTrigger>
            <SelectContent className="bg-automotive-dark border-automotive-blue/20">
              <SelectItem value="all" className="text-white">Alla märken</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand} className="text-white">
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Avstånd */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-automotive-orange" />
            <label className="text-sm font-medium text-white">Avstånd från dig</label>
          </div>
          <Slider
            value={[filters.radius]}
            onValueChange={(value) => updateFilter("radius", value[0])}
            max={500}
            min={10}
            step={10}
            className="w-full"
          />
          <div className="text-center">
            <Badge className="bg-automotive-orange/20 text-automotive-orange">
              {filters.radius} km
            </Badge>
          </div>
        </div>

        {/* Verifieringsstatus */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <label className="text-sm font-medium text-white">Verifieringsstatus</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "all", label: "Alla fordon", color: "automotive-blue" },
              { id: "verified", label: "Fullständigt verifierade", color: "green-500" },
              { id: "partial", label: "Delvis verifierade", color: "automotive-orange" },
              { id: "unverified", label: "Overifierade", color: "red-500" }
            ].map((status) => (
              <Button
                key={status.id}
                variant={filters.verificationStatus === status.id ? "default" : "ghost"}
                onClick={() => updateFilter("verificationStatus", status.id)}
                className={`justify-start text-xs ${
                  filters.verificationStatus === status.id
                    ? `bg-${status.color}/20 text-${status.color} border border-${status.color}/30`
                    : "text-automotive-silver hover:text-white"
                }`}
              >
                <div className={`w-2 h-2 rounded-full bg-${status.color} mr-2`} />
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full bg-automotive-blue/10 border-automotive-blue/20 text-automotive-blue hover:bg-automotive-blue/20"
          onClick={() => onFiltersChange({
            priceRange: [0, 1000000],
            brand: "all",
            radius: 50,
            verificationStatus: "all"
          })}
        >
          Rensa filter
        </Button>
      </CardContent>
    </Card>
  );
}
