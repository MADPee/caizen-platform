
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecurityBadge } from "@/components/ui/security-badge";
import { Heart, Eye, MapPin, Calendar, Gauge, Fuel } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  registrationMasked: string;
  vinMasked: string;
  verificationStatus: "verified" | "partial" | "unverified";
  hasServiceHistory: boolean;
  documentationScore: number;
  photoCount: number;
  brand: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  description: string;
  features: string[];
  distance: number;
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified": return "green-500";
      case "partial": return "automotive-orange";
      case "unverified": return "red-500";
      default: return "automotive-blue";
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case "verified": return "Fullständigt verifierad";
      case "partial": return "Delvis verifierad";
      case "unverified": return "Overifierad";
      default: return "Status okänd";
    }
  };

  return (
    <Card className="bg-automotive-darker border-automotive-blue/20 hover:border-automotive-blue/40 transition-colors overflow-hidden group">
      {/* Fordonsbild placeholder */}
      <div className="relative bg-gradient-to-br from-automotive-blue/20 to-automotive-purple/20 h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-automotive-blue mb-2">
            {listing.brand}
          </div>
          <div className="text-sm text-automotive-silver">
            {listing.photoCount} foton
          </div>
        </div>
        
        {/* Verifieringsbadge */}
        <div className="absolute top-3 left-3">
          <SecurityBadge 
            level={listing.verificationStatus === "verified" ? "verified" : "masked"} 
            className="text-xs"
          />
        </div>

        {/* Favoritknapp */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white"
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Dokumentationspoäng */}
        <div className="absolute bottom-3 right-3">
          <Badge className={`bg-${getVerificationColor(listing.verificationStatus)}/20 text-${getVerificationColor(listing.verificationStatus)} text-xs`}>
            {listing.documentationScore}% dokument
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Titel och pris */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-automotive-blue transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-automotive-orange font-bold text-lg">
              {listing.price.toLocaleString()} kr
            </span>
            <div className="flex items-center gap-1 text-automotive-silver text-xs">
              <MapPin className="w-3 h-3" />
              <span>{listing.location} • {listing.distance} km</span>
            </div>
          </div>
        </div>

        {/* Fordonsdetaljer */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-automotive-silver">
            <Calendar className="w-3 h-3" />
            <span>{listing.year}</span>
          </div>
          <div className="flex items-center gap-1 text-automotive-silver">
            <Gauge className="w-3 h-3" />
            <span>{listing.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1 text-automotive-silver">
            <Fuel className="w-3 h-3" />
            <span>{listing.fuelType}</span>
          </div>
          <div className="flex items-center gap-1 text-automotive-silver">
            <span>{listing.transmission}</span>
          </div>
        </div>

        {/* Maskerade identifierare */}
        <div className="flex justify-between text-xs text-automotive-silver bg-automotive-dark p-2 rounded">
          <span>Reg: {listing.registrationMasked}</span>
          <span>VIN: {listing.vinMasked}</span>
        </div>

        {/* Verifieringsstatus */}
        <div className="flex items-center justify-between">
          <div className={`text-xs text-${getVerificationColor(listing.verificationStatus)}`}>
            {getVerificationText(listing.verificationStatus)}
          </div>
          {listing.hasServiceHistory && (
            <Badge className="bg-automotive-blue/20 text-automotive-blue text-xs">
              Servicehistorik
            </Badge>
          )}
        </div>

        {/* Funktioner */}
        <div className="flex flex-wrap gap-1">
          {listing.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-automotive-blue/10 text-automotive-blue">
              {feature}
            </Badge>
          ))}
          {listing.features.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-automotive-silver/10 text-automotive-silver">
              +{listing.features.length - 3} fler
            </Badge>
          )}
        </div>

        {/* Kontaktknapp */}
        <Button 
          className="w-full bg-automotive-blue hover:bg-automotive-blue/80 text-white font-medium"
          size="sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Visa detaljer
        </Button>
      </CardContent>
    </Card>
  );
}
