/**
 * CaiZen - usePriceSearch Hook
 * Hanterar prisjämförelse-sökning med state management
 */

import { useState, useCallback, useRef } from "react";
import { priceService } from "../services/priceService";
import type {
  PriceSearchQuery,
  PriceSearchResult,
  PriceHistory,
  ProductCategory,
  PriceSortOption,
  Retailer,
} from "../../types";

interface UsePriceSearchState {
  result: PriceSearchResult | null;
  isLoading: boolean;
  error: string | null;
  query: PriceSearchQuery;
  priceHistory: PriceHistory | null;
  isLoadingHistory: boolean;
  categories: Array<{ value: ProductCategory; label: string; count: number }>;
  brands: string[];
  retailers: Retailer[];
}

const DEFAULT_QUERY: PriceSearchQuery = {
  query: "",
  sortBy: "price_lowest",
  sortOrder: "asc",
  onlyInStock: true,
};

export function usePriceSearch() {
  const [state, setState] = useState<UsePriceSearchState>({
    result: null,
    isLoading: false,
    error: null,
    query: DEFAULT_QUERY,
    priceHistory: null,
    isLoadingHistory: false,
    categories: [],
    brands: [],
    retailers: [],
  });

  const searchIdRef = useRef(0);

  const search = useCallback(async (query: Partial<PriceSearchQuery>) => {
    const fullQuery: PriceSearchQuery = {
      ...DEFAULT_QUERY,
      ...query,
    };

    const searchId = ++searchIdRef.current;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      query: fullQuery,
    }));

    try {
      const result = await priceService.search(fullQuery);

      if (searchId !== searchIdRef.current) return;

      setState((prev) => ({
        ...prev,
        result,
        isLoading: false,
      }));
    } catch (err) {
      if (searchId !== searchIdRef.current) return;

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "Ett oväntat fel uppstod vid sökning",
      }));
    }
  }, []);

  const updateSort = useCallback(
    (sortBy: PriceSortOption, sortOrder?: "asc" | "desc") => {
      setState((prev) => {
        const newQuery = {
          ...prev.query,
          sortBy,
          sortOrder: sortOrder ?? prev.query.sortOrder,
        };
        search(newQuery);
        return { ...prev, query: newQuery };
      });
    },
    [search],
  );

  const loadPriceHistory = useCallback(
    async (productId: string, retailerId: string) => {
      setState((prev) => ({
        ...prev,
        isLoadingHistory: true,
        priceHistory: null,
      }));

      try {
        const history = await priceService.getPriceHistory(
          productId,
          retailerId,
        );
        setState((prev) => ({
          ...prev,
          priceHistory: history ?? null,
          isLoadingHistory: false,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          isLoadingHistory: false,
        }));
      }
    },
    [],
  );

  const loadMetadata = useCallback(async () => {
    const [categories, brands, retailers] = await Promise.all([
      priceService.getCategories(),
      priceService.getBrands(),
      priceService.getRetailers(),
    ]);

    setState((prev) => ({ ...prev, categories, brands, retailers }));
  }, []);

  const clearResults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      result: null,
      error: null,
      query: DEFAULT_QUERY,
      priceHistory: null,
    }));
  }, []);

  return {
    ...state,
    search,
    updateSort,
    loadPriceHistory,
    loadMetadata,
    clearResults,
  };
}
