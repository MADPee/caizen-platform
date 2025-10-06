
import { useState } from "react";
import { ListingCard } from "./listing-card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface VehicleListingsProps {
  searchQuery: string;
  filters: {
    priceRange: number[];
    brand: string;
    radius: number;
    verificationStatus: string;
  };
}

// Tom lista initialt – fylls från backend vid integration
const mockListings: any[] = [];

export function VehicleListings({ searchQuery, filters }: VehicleListingsProps) {
  const [sortBy, setSortBy] = useState("price-low");

  // Filtrera listings baserat på sök och filter
  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = 
      listing.price >= filters.priceRange[0] && 
      listing.price <= filters.priceRange[1];
    
    const matchesBrand = 
      filters.brand === "all" || !filters.brand || listing.brand === filters.brand;
    
    const matchesRadius = 
      listing.distance <= filters.radius;
    
    const matchesVerification = 
      filters.verificationStatus === "all" || 
      listing.verificationStatus === filters.verificationStatus;

    return matchesSearch && matchesPrice && matchesBrand && matchesRadius && matchesVerification;
  });

  // Sortera listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "year-new":
        return b.year - a.year;
      case "mileage-low":
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Resultat header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-automotive-darker rounded-lg border border-automotive-blue/20">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-automotive-blue" />
          <span className="text-white font-medium">
            {sortedListings.length} fordon hittades
          </span>
          {searchQuery && (
            <Badge className="bg-automotive-blue/20 text-automotive-blue">
              "{searchQuery}"
            </Badge>
          )}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-automotive-dark border border-automotive-blue/20 text-white rounded-md px-3 py-1 text-sm"
        >
          <option value="price-low">Pris: Lägst först</option>
          <option value="price-high">Pris: Högst först</option>
          <option value="year-new">Årsmodell: Nyast först</option>
          <option value="mileage-low">Miltal: Lägst först</option>
        </select>
      </div>

      {/* Listings */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl-grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-automotive-silver mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Inga fordon hittades</h3>
          <p className="text-automotive-silver">
            Prova att justera dina sökkriterier eller filter
          </p>
        </div>
      )}
    </div>
  );
}
