
import { Search, Map, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MarketplaceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MarketplaceHeader({ searchQuery, onSearchChange }: MarketplaceHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Marknadsplats</h1>
          <p className="text-automotive-silver mt-2">
            Upptäck verifierade fordon med militärgrad säkerhet
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="bg-automotive-darker border-automotive-blue/20 text-automotive-blue">
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button variant="ghost" className="text-automotive-silver">
            <Map className="w-4 h-4 mr-2" />
            Karta (Kommer snart)
          </Button>
        </div>
      </div>

      <Card className="bg-automotive-darker border-automotive-blue/20 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-automotive-silver w-4 h-4" />
          <Input
            placeholder="Sök efter märke, modell eller stad..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-automotive-dark border-automotive-blue/20 text-white placeholder:text-automotive-silver"
          />
        </div>
      </Card>
    </div>
  );
}
