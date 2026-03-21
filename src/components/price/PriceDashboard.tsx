/**
 * CaiZen - PriceDashboard
 * Huvudvy för prisjämförelse och prisindexering
 */

import React, { useEffect } from "react";
import {
  BarChart3,
  TrendingDown,
  ShoppingCart,
  AlertCircle,
  RefreshCw,
  Shield,
} from "lucide-react";
import PriceSearch from "./PriceSearch";
import PriceResults from "./PriceResults";
import { usePriceSearch } from "../../lib/hooks/usePriceSearch";

interface PriceDashboardProps {
  className?: string;
}

function formatSEK(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const PriceDashboard: React.FC<PriceDashboardProps> = ({ className = "" }) => {
  const {
    result,
    isLoading,
    error,
    categories,
    brands,
    search,
    loadMetadata,
    clearResults,
  } = usePriceSearch();

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  const totalProducts = result?.totalResults ?? 0;
  const totalRetailers = result?.retailers.length ?? 0;
  const bestPrice = result?.priceRange.min ?? 0;
  const saleCount =
    result?.products.reduce(
      (sum, p) => sum + p.prices.filter((pr) => pr.isOnSale).length,
      0,
    ) ?? 0;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={24} />
              Prisjämförelse
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Sök och jämför priser på fordonsdelar från svenska butiker
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield size={14} className="text-green-500" />
            Inga affiliatelänkar — oberoende priser
          </div>
        </div>
      </div>

      {/* Statistik-kort */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <ShoppingCart size={14} />
              Produkter
            </div>
            <div className="text-xl font-bold">{totalProducts}</div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <BarChart3 size={14} />
              Butiker
            </div>
            <div className="text-xl font-bold">{totalRetailers}</div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
            <div className="flex items-center gap-2 text-green-400 text-xs mb-1">
              <TrendingDown size={14} />
              Lägsta pris
            </div>
            <div className="text-xl font-bold text-green-400">
              {bestPrice > 0 ? formatSEK(bestPrice) : "—"}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
            <div className="flex items-center gap-2 text-orange-400 text-xs mb-1">
              <TrendingDown size={14} />
              Rea-erbjudanden
            </div>
            <div className="text-xl font-bold text-orange-400">{saleCount}</div>
          </div>
        </div>
      )}

      {/* Sökformulär */}
      <PriceSearch
        onSearch={search}
        isLoading={isLoading}
        categories={categories}
        brands={brands}
        className="mb-6"
      />

      {/* Felmeddelande */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-medium">
              Sökning misslyckades
            </p>
            <p className="text-xs text-red-300 mt-1">{error}</p>
            <button
              onClick={clearResults}
              className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1"
            >
              <RefreshCw size={12} />
              Försök igen
            </button>
          </div>
        </div>
      )}

      {/* Laddar */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <RefreshCw
              size={32}
              className="mx-auto text-blue-500 animate-spin mb-3"
            />
            <p className="text-sm text-gray-400">
              Söker priser i svenska butiker...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Jämför priser från Biltema, Mekonomen, Skruvat och fler
            </p>
          </div>
        </div>
      )}

      {/* Resultat */}
      {!isLoading && result && <PriceResults result={result} />}

      {/* Tomt tillstånd */}
      {!isLoading && !result && !error && (
        <div className="text-center py-16">
          <BarChart3 size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-400">
            Börja söka priser
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Ange produktnamn, viskositet eller artikelnummer för att jämföra
            priser från svenska bildelarbutiker.
          </p>
        </div>
      )}

      {/* Info-panel */}
      <div className="mt-8 bg-blue-900/10 border border-blue-800/30 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">
          Om prisjämförelsen
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-400">
          <div>
            <strong className="text-gray-300">Oberoende priser:</strong> Vi
            använder inga affiliatelänkar. Alla priser hämtas direkt från
            butikerna utan påslag.
          </div>
          <div>
            <strong className="text-gray-300">Uppdatering:</strong> Priser
            indexeras löpande och verifieras mot butikernas webbplatser.
            Prishistorik sparas för trendanalys.
          </div>
          <div>
            <strong className="text-gray-300">Täckning:</strong> Vi jämför
            priser från Biltema, Mekonomen, Skruvat.se, AK24.se, Weboil.se,
            AutoExperten och Motonet.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDashboard;
