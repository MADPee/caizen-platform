
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

// Mockdata för marknadsplats med säkra, maskerade identifierare
const mockListings = [
  {
    id: "1",
    title: "BMW M3 E46 2002 - Välskött entusiast-ägd",
    price: 285000,
    location: "Stockholm",
    registrationMasked: "ABC***",
    vinMasked: "WBA***********1234",
    verificationStatus: "verified" as const,
    hasServiceHistory: true,
    documentationScore: 95,
    photoCount: 12,
    brand: "BMW",
    year: 2002,
    mileage: 145000,
    fuelType: "Bensin",
    transmission: "Manuell",
    description: "Exceptionellt välskött M3 med komplett servicehistorik. Originallack, inga olyckor.",
    features: ["Originalfärg", "Servicebok", "Inga olyckor", "Entusiast-ägd"],
    distance: 15
  },
  {
    id: "2", 
    title: "Volvo V70 2018 - Familjevänlig & säker",
    price: 420000,
    location: "Göteborg",
    registrationMasked: "DEF***",
    vinMasked: "YV1***********5678",
    verificationStatus: "partial" as const,
    hasServiceHistory: true,
    documentationScore: 78,
    photoCount: 8,
    brand: "Volvo",
    year: 2018,
    mileage: 89000,
    fuelType: "Diesel",
    transmission: "Automat",
    description: "Perfekt familjekombi med låg miltal. Välservad hos auktoriserad verkstad.",
    features: ["Låg miltal", "Automat", "Dragkrok", "Sommardäck ingår"],
    distance: 45
  },
  {
    id: "3",
    title: "Audi A4 Avant 2020 - Som ny",
    price: 485000,
    location: "Malmö", 
    registrationMasked: "GHI***",
    vinMasked: "WAU***********9012",
    verificationStatus: "verified" as const,
    hasServiceHistory: true,
    documentationScore: 92,
    photoCount: 15,
    brand: "Audi",
    year: 2020,
    mileage: 32000,
    fuelType: "Bensin",
    transmission: "Automat",
    description: "Nästan ny A4 Avant med full utrustning. Endast en ägare, garangi kvar.",
    features: ["En ägare", "Garanti", "Full utrustning", "Metallic"],
    distance: 78
  }
];

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

      {/* Listings grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {sortedListings.length === 0 && (
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
