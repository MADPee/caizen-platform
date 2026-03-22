/**
 * CaiZen - PriceResults
 * Visar prisjämförelseresultat med detaljerade produktkort
 */

import React, { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  ExternalLink,
  Star,
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Percent,
  ListPlus,
} from "lucide-react";
import type {
  PriceSearchResult,
  Product,
  PriceEntry,
  PriceTrend,
} from "../../types";

interface PriceResultsProps {
  result: PriceSearchResult;
  onAddToList?: (product: Product, price: PriceEntry) => void;
  onProductSelect?: (productId: string) => void;
  className?: string;
}

function TrendIcon({ trend, size = 14 }: { trend: PriceTrend; size?: number }) {
  switch (trend) {
    case "falling":
      return <TrendingDown size={size} className="text-green-400" />;
    case "rising":
      return <TrendingUp size={size} className="text-red-400" />;
    default:
      return <Minus size={size} className="text-gray-400" />;
  }
}

function trendLabel(trend: PriceTrend): string {
  switch (trend) {
    case "falling":
      return "Sjunkande";
    case "rising":
      return "Stigande";
    default:
      return "Stabilt";
  }
}

function formatSEK(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function PriceRow({
  price,
  onAddToList,
}: {
  price: PriceEntry;
  onAddToList?: () => void;
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToList) {
      onAddToList();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded ${
        price.isOnSale ? "bg-green-900/20" : "bg-gray-700/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 w-24">
          <span className="text-sm font-medium text-gray-200">
            {price.retailer.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          {price.retailer.pickupAvailable && (
            <span className="flex items-center gap-1" title="Hämta i butik">
              <MapPin size={11} />
              <Clock size={11} />
              {price.retailer.pickupTimeHours}h
            </span>
          )}
          {price.retailer.type === "online" && (
            <span className="flex items-center gap-1" title="Online">
              <Truck size={11} />
              {price.retailer.shippingCostSEK === 0
                ? "Fri frakt"
                : `${price.retailer.shippingCostSEK} kr frakt`}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {price.isOnSale && price.originalPrice && (
          <span className="text-xs text-gray-500 line-through">
            {formatSEK(price.originalPrice)}
          </span>
        )}
        {price.isOnSale && price.salePercentage && (
          <span className="flex items-center gap-0.5 text-xs text-green-400 bg-green-900/40 px-1.5 py-0.5 rounded">
            <Percent size={10} />-{price.salePercentage}%
          </span>
        )}

        <span
          className={`font-bold text-sm ${
            price.isOnSale ? "text-green-400" : "text-white"
          }`}
        >
          {formatSEK(price.priceSEK)}
        </span>

        {price.pricePerUnit && (
          <span className="text-[10px] text-gray-500 w-16 text-right">
            {Math.round(price.pricePerUnit)} kr/L
          </span>
        )}

        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            price.inStock
              ? "bg-green-900/40 text-green-400"
              : "bg-red-900/40 text-red-400"
          }`}
        >
          {price.inStock ? "I lager" : "Slut"}
        </span>

        {onAddToList && (
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
              added
                ? "bg-green-600 text-white"
                : "bg-orange-600/20 text-orange-400 hover:bg-orange-600/40"
            }`}
            title="Lägg till i inköpslista"
          >
            <ListPlus size={11} />
            {added ? "Tillagd!" : "Köplista"}
          </button>
        )}

        <a
          href={price.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
          title="Gå till butik"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  isFirst,
  onAddToList,
}: {
  product: Product;
  isFirst: boolean;
  onAddToList?: (product: Product, price: PriceEntry) => void;
}) {
  const [expanded, setExpanded] = useState(isFirst);

  const sortedPrices = [...product.prices].sort(
    (a, b) => a.priceSEK - b.priceSEK,
  );
  const cheapest = sortedPrices[0];
  const savingsVsMax = product.highestPrice - product.lowestPrice;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden animate-slide-up">
      {/* Produkthuvud */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isFirst && (
                <span className="flex items-center gap-1 text-[10px] bg-yellow-600/30 text-yellow-400 px-2 py-0.5 rounded-full">
                  <Award size={10} />
                  BÄST PRIS
                </span>
              )}
              {product.prices.some((p) => p.isOnSale) && (
                <span className="flex items-center gap-1 text-[10px] bg-green-600/30 text-green-400 px-2 py-0.5 rounded-full">
                  <Percent size={10} />
                  REA
                </span>
              )}
              {product.specifications["High Mileage"] === "Ja" && (
                <span className="text-[10px] bg-purple-600/30 text-purple-400 px-2 py-0.5 rounded-full">
                  HIGH MILEAGE
                </span>
              )}
            </div>

            <h3 className="text-sm font-semibold text-white truncate">
              {product.name}
            </h3>

            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(product.specifications)
                .slice(0, 4)
                .map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                  >
                    {key}: {val}
                  </span>
                ))}
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-bold text-white">
              {formatSEK(product.lowestPrice)}
            </div>
            {product.pricePerLiter && (
              <div className="text-xs text-gray-400">
                {Math.round(product.pricePerLiter)} kr/liter
              </div>
            )}
            <div className="flex items-center justify-end gap-1 mt-1">
              <TrendIcon trend={product.priceTrend} />
              <span className="text-[10px] text-gray-400">
                {trendLabel(product.priceTrend)}
              </span>
            </div>
            {product.rating && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-300">{product.rating}</span>
                <span className="text-[10px] text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Prissammanfattning (alltid synlig) */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <ShoppingCart size={12} />
            {product.prices.length} butiker
          </span>
          <span className="flex items-center gap-1">
            <Package size={12} />
            Från {formatSEK(product.lowestPrice)} till{" "}
            {formatSEK(product.highestPrice)}
          </span>
          {savingsVsMax > 0 && (
            <span className="text-green-400">
              Spara upp till {formatSEK(savingsVsMax)}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-blue-400">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Dölj" : "Visa"} priser
          </span>
        </div>
      </div>

      {/* Expanderade priser */}
      {expanded && (
        <div className="border-t border-gray-700 p-3 space-y-1 bg-gray-850">
          {sortedPrices.map((price) => (
            <PriceRow
              key={price.id}
              price={price}
              onAddToList={
                onAddToList ? () => onAddToList(product, price) : undefined
              }
            />
          ))}

          {cheapest && cheapest.retailer.freeShippingThresholdSEK && (
            <div className="text-[10px] text-gray-500 mt-2 px-3">
              Fri frakt hos {cheapest.retailer.name} vid köp över{" "}
              {formatSEK(cheapest.retailer.freeShippingThresholdSEK)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PriceResults: React.FC<PriceResultsProps> = ({
  result,
  onAddToList,
  className = "",
}) => {
  if (result.totalResults === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Package size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-400">
          Inga produkter hittades
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Prova att ändra sökord eller filter
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Resultatsammanfattning */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          <span className="font-medium text-white">
            {result.totalResults} produkter
          </span>{" "}
          hittades
          {result.searchTime > 0 && (
            <span className="ml-1">({result.searchTime} ms)</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>
            Prisintervall: {formatSEK(result.priceRange.min)} –{" "}
            {formatSEK(result.priceRange.max)}
          </span>
          <span>|</span>
          <span>Snitt: {formatSEK(result.priceRange.average)}</span>
        </div>
      </div>

      {/* Produktlista */}
      <div className="space-y-3">
        {result.products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            isFirst={idx === 0}
            onAddToList={onAddToList}
          />
        ))}
      </div>

      {/* Butiksinformation */}
      <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
        <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Butiker i sökningen
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.retailers.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-200 truncate">
                  {r.name}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Star size={9} className="text-yellow-400 fill-yellow-400" />
                  {r.trustScore}/100
                  {r.pickupAvailable && (
                    <>
                      <span className="mx-0.5">·</span>
                      <MapPin size={9} />
                      Butik
                    </>
                  )}
                </div>
              </div>
              <ExternalLink size={12} className="text-gray-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceResults;
