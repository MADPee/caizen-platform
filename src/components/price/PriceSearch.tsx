/**
 * CaiZen - PriceSearch
 * Sökformulär för prisjämförelse av fordonsdelar
 */

import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, Tag } from "lucide-react";
import type {
  PriceSearchQuery,
  ProductCategory,
  PriceSortOption,
} from "../../types";

interface PriceSearchProps {
  onSearch: (query: Partial<PriceSearchQuery>) => void;
  isLoading: boolean;
  categories: Array<{ value: ProductCategory; label: string; count: number }>;
  brands: string[];
  className?: string;
}

const SORT_OPTIONS: Array<{ value: PriceSortOption; label: string }> = [
  { value: "price_lowest", label: "Lägst pris" },
  { value: "price_highest", label: "Högst pris" },
  { value: "price_per_unit", label: "Bäst literpris" },
  { value: "rating", label: "Bäst betyg" },
  { value: "relevance", label: "Relevans" },
];

const VISCOSITY_OPTIONS = [
  "0W-20",
  "0W-30",
  "5W-30",
  "5W-40",
  "10W-40",
  "15W-50",
];

const QUICK_SEARCHES = [
  {
    label: "5W-40 Motorolja",
    query: "5W-40",
    category: "motor_oil" as ProductCategory,
  },
  {
    label: "Oljefilter Volvo",
    query: "oljefilter Volvo",
    category: "oil_filter" as ProductCategory,
  },
  {
    label: "High Mileage-olja",
    query: "MaxLife high mileage",
    category: "motor_oil" as ProductCategory,
  },
  { label: "Castrol EDGE", query: "Castrol EDGE", category: undefined },
  {
    label: "Budget-olja",
    query: "Biltema 5W-40",
    category: "motor_oil" as ProductCategory,
  },
];

const PriceSearch: React.FC<PriceSearchProps> = ({
  onSearch,
  isLoading,
  categories,
  brands,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [brand, setBrand] = useState("");
  const [viscosity, setViscosity] = useState("");
  const [sortBy, setSortBy] = useState<PriceSortOption>("price_lowest");
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!hasSearched) {
      onSearch({
        query: "5W-40",
        category: "motor_oil",
        sortBy: "price_lowest",
        sortOrder: "asc",
        onlyInStock: true,
      });
      setQuery("5W-40");
      setCategory("motor_oil");
      setHasSearched(true);
    }
  }, [hasSearched, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const executeSearch = () => {
    onSearch({
      query,
      sortBy,
      sortOrder: "asc",
      onlyInStock,
      onlyOnSale,
      ...(category ? { category: category as ProductCategory } : {}),
      ...(brand ? { brand } : {}),
      ...(viscosity
        ? { viscosity: viscosity as PriceSearchQuery["viscosity"] }
        : {}),
      ...(maxPrice ? { maxPriceSEK: parseInt(maxPrice) } : {}),
    });
  };

  const handleQuickSearch = (qs: (typeof QUICK_SEARCHES)[number]) => {
    setQuery(qs.query);
    setCategory(qs.category ?? "");
    onSearch({
      query: qs.query,
      category: qs.category,
      sortBy,
      sortOrder: "asc",
      onlyInStock,
    });
  };

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setViscosity("");
    setMaxPrice("");
    setOnlyOnSale(false);
    setOnlyInStock(true);
    setSortBy("price_lowest");
  };

  const activeFilterCount = [
    category,
    brand,
    viscosity,
    maxPrice,
    onlyOnSale ? "sale" : "",
  ].filter(Boolean).length;

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}
    >
      {/* Sökfält */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök motorolja, filter, delar... (t.ex. 5W-40, Castrol EDGE)"
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-3 rounded-lg border transition-colors relative ${
              showFilters || activeFilterCount > 0
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <SlidersHorizontal size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {isLoading ? "Söker..." : "Sök priser"}
          </button>
        </div>

        {/* Snabbsök */}
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_SEARCHES.map((qs) => (
            <button
              key={qs.label}
              type="button"
              onClick={() => handleQuickSearch(qs)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-gray-300 transition-colors"
            >
              <Tag size={12} />
              {qs.label}
            </button>
          ))}
        </div>
      </form>

      {/* Filter-panel */}
      {showFilters && (
        <div className="border-t border-gray-700 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">
              Filtrera resultat
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <X size={12} />
              Rensa filter
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Kategori */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ProductCategory | "")
                }
                className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
              >
                <option value="">Alla</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} ({c.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Märke */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Märke</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
              >
                <option value="">Alla</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Viskositet */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Viskositet
              </label>
              <select
                value={viscosity}
                onChange={(e) => setViscosity(e.target.value)}
                className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
              >
                <option value="">Alla</option>
                {VISCOSITY_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Max pris */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Max pris (kr)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="t.ex. 500"
                className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
              />
            </div>

            {/* Sortering */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Sortera
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PriceSortOption)}
                className="w-full px-2 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxar */}
            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded"
                />
                Bara i lager
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOnSale}
                  onChange={(e) => setOnlyOnSale(e.target.checked)}
                  className="rounded"
                />
                Bara rea
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={executeSearch}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm transition-colors"
            >
              Tillämpa filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceSearch;
