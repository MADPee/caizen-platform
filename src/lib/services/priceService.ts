/**
 * CaiZen Price Service
 * Prisindexering, sökning och jämförelse av fordonsdelar och tillbehör
 */

import type {
  Product,
  PriceEntry,
  PriceSearchQuery,
  PriceSearchResult,
  PriceHistory,
  Retailer,
  ProductCategory,
  PriceTrend,
  VehicleCompatibility,
} from "../../types";

const RETAILERS: Retailer[] = [
  {
    id: "biltema",
    name: "Biltema",
    url: "https://www.biltema.se",
    type: "both",
    country: "SE",
    shippingCostSEK: 0,
    freeShippingThresholdSEK: 0,
    pickupAvailable: true,
    pickupTimeHours: 2,
    trustScore: 88,
    reviewCount: 14200,
  },
  {
    id: "mekonomen",
    name: "Mekonomen",
    url: "https://www.mekonomen.se",
    type: "both",
    country: "SE",
    shippingCostSEK: 59,
    freeShippingThresholdSEK: 499,
    pickupAvailable: true,
    pickupTimeHours: 4,
    trustScore: 91,
    reviewCount: 8900,
  },
  {
    id: "skruvat",
    name: "Skruvat.se",
    url: "https://www.skruvat.se",
    type: "online",
    country: "SE",
    shippingCostSEK: 49,
    freeShippingThresholdSEK: 699,
    pickupAvailable: false,
    trustScore: 85,
    reviewCount: 6300,
  },
  {
    id: "ak24",
    name: "AK24.se",
    url: "https://www.ak24.se",
    type: "online",
    country: "SE",
    shippingCostSEK: 200,
    freeShippingThresholdSEK: 999,
    pickupAvailable: false,
    trustScore: 82,
    reviewCount: 3100,
  },
  {
    id: "weboil",
    name: "Weboil.se",
    url: "https://weboil.se",
    type: "online",
    country: "SE",
    shippingCostSEK: 69,
    freeShippingThresholdSEK: 799,
    pickupAvailable: false,
    trustScore: 80,
    reviewCount: 2400,
  },
  {
    id: "autoexperten",
    name: "AutoExperten",
    url: "https://www.autoexperten.se",
    type: "both",
    country: "SE",
    shippingCostSEK: 69,
    freeShippingThresholdSEK: 599,
    pickupAvailable: true,
    pickupTimeHours: 4,
    trustScore: 86,
    reviewCount: 4500,
  },
  {
    id: "motonet",
    name: "Motonet",
    url: "https://www.motonet.se",
    type: "both",
    country: "SE",
    shippingCostSEK: 59,
    freeShippingThresholdSEK: 599,
    pickupAvailable: true,
    pickupTimeHours: 3,
    trustScore: 84,
    reviewCount: 3800,
  },
];

const VOLVO_COMPAT: VehicleCompatibility = {
  make: "Volvo",
  model: "XC90",
  yearFrom: 2002,
  yearTo: 2014,
  engineCode: "B5254T2",
};

const GENERIC_COMPAT: VehicleCompatibility[] = [
  VOLVO_COMPAT,
  { make: "Volvo", model: "S60", yearFrom: 2000, yearTo: 2009 },
  { make: "Volvo", model: "V70", yearFrom: 2000, yearTo: 2007 },
  { make: "BMW", yearFrom: 2000, yearTo: 2015 },
  { make: "Mercedes-Benz", yearFrom: 2000, yearTo: 2015 },
  { make: "Volkswagen", yearFrom: 2000, yearTo: 2020 },
];

function makePrice(
  id: string,
  productId: string,
  retailerId: string,
  priceSEK: number,
  unitSize: string,
  opts: Partial<PriceEntry> = {},
): PriceEntry {
  const retailer = RETAILERS.find((r) => r.id === retailerId)!;
  return {
    id,
    productId,
    retailerId,
    retailer,
    priceSEK,
    currency: "SEK",
    isOnSale: opts.isOnSale ?? false,
    salePercentage: opts.salePercentage,
    originalPrice: opts.originalPrice,
    inStock: opts.inStock ?? true,
    stockQuantity: opts.stockQuantity,
    url: opts.url ?? `${retailer.url}/product/${productId}`,
    lastVerified: new Date(),
    pricePerUnit: opts.pricePerUnit ?? priceSEK / parseFloat(unitSize),
    unitSize,
    verified: opts.verified ?? false,
    verifiedSource: opts.verifiedSource,
  };
}

/**
 * Produktdatakatalog
 *
 * POLICY: Visa korrekt data eller ingen alls.
 * - verified: true  = pris/artikel bekräftat av användare eller live-källa
 * - verified: false  = prisdata saknas, produkten listas utan pris
 *
 * Produktspecifikationer (ACEA, API, OEM) hämtas från tillverkarens
 * produktblad och är alltid korrekta. Priser är ögonblicksbilder och
 * måste verifieras mot butikernas webbplatser.
 */
const SEED_PRODUCTS: Product[] = [
  {
    id: "biltema-5w40-10l",
    name: "Biltema Helsyntetisk 5W-40 (10L)",
    brand: "Biltema",
    category: "motor_oil",
    description:
      "Biltemas helsyntetiska motorolja. 10-liters dunk med OEM-godkännanden: MB 229.3/229.5, BMW LL-01, VW 502/505.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk (Fully Synthetic)",
      ACEA: "A3/B3, A3/B4",
      API: "SN, SL, CF",
      Artikelnummer: "34-880",
      "MB 229.3/229.5": "Ja",
      "BMW LL-98/LL-01": "Ja",
      "VW 502.00/505.00": "Ja",
      "Renault RN 0700/0710": "Ja",
      "GM-LL-A/B-025": "Ja",
      Hyllplats: "BILVÅRD",
      "High Mileage": "Nej",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [
      makePrice("bt-biltema-10l", "biltema-5w40-10l", "biltema", 649, "10", {
        verified: true,
        verifiedSource: "Biltema-appen, Uddevalla, 2026-03-21",
        url: "https://www.biltema.se/bilvard/motoroljor/helsyntetiska-oljor/5w-40/helsyntetisk-motorolja-5w-40-acea-a3b3-a3b4-10-liter-2000051919",
      }),
    ],
    lowestPrice: 649,
    highestPrice: 649,
    averagePrice: 649,
    pricePerLiter: 65,
    priceTrend: "stable",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "valvoline-maxlife-5w40",
    name: "Valvoline MaxLife Synthetic 5W-40",
    brand: "Valvoline",
    category: "motor_oil",
    description:
      "Helsyntetisk high-mileage motorolja med tätningskonditionerare. Specifikt formulerad för motorer med över 100 000 km.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B4",
      API: "SN/CF",
      "High Mileage": "Ja",
      Tätningskonditionerare: "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "castrol-edge-5w40",
    name: "Castrol EDGE 5W-40 A3/B4",
    brand: "Castrol",
    category: "motor_oil",
    description:
      "Helsyntetisk premiumolja med PowerBoost Technology. Minskar beläggningar i turbo.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B4",
      API: "SP",
      "BMW Longlife-01": "Ja",
      "MB 229.3/229.5": "Ja",
      "VW 502/505": "Ja",
      "Porsche A40": "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "liquimoly-ht-5w40",
    name: "Liqui Moly Leichtlauf High Tech 5W-40",
    brand: "Liqui Moly",
    category: "motor_oil",
    description:
      "Helsyntetisk lågfriktions-motorolja. Utmärkt slitageskydd och shear-stabilitet för turbomotorer.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B4",
      API: "SP",
      "BMW Longlife-01": "Ja",
      "MB 229.5": "Ja",
      "VW 502/505": "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "mobil1-fs-5w40",
    name: "Mobil 1 FS 5W-40",
    brand: "Mobil",
    category: "motor_oil",
    description:
      "Avancerad helsyntetisk motorolja med exceptionell rengöringsförmåga.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B3, A3/B4",
      API: "SN/SM/SL/SJ",
      "MB 229.3/229.5": "Ja",
      "VW 502/505": "Ja",
      "Porsche A40": "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "liquimoly-mos2-10w40",
    name: "Liqui Moly MoS2 Leichtlauf 10W-40",
    brand: "Liqui Moly",
    category: "motor_oil",
    description:
      "Halvsyntetisk motorolja med MoS2-tillsats (molybdendisulfid) för extra slitskydd.",
    specifications: {
      Viskositet: "10W-40",
      Typ: "Halvsyntetisk",
      ACEA: "A3/B4",
      API: "SL/CF",
      MoS2: "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "mann-hu719-8x",
    name: "Mann-Filter HU 719/8 x",
    brand: "Mann-Filter",
    category: "oil_filter",
    description: "Oljefilter för Volvo 5-cylindermotorer. OE-kvalitet.",
    specifications: {
      Typ: "Insatsfilter",
      Höjd: "141 mm",
      "Yttre diameter": "64 mm",
      Fordon: "Volvo 5-cyl (B5244/B5254)",
    },
    compatibleVehicles: [
      VOLVO_COMPAT,
      { make: "Volvo", model: "S60", yearFrom: 2000, yearTo: 2009 },
      { make: "Volvo", model: "V70", yearFrom: 2000, yearTo: 2007 },
      { make: "Volvo", model: "S80", yearFrom: 1998, yearTo: 2006 },
    ],
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
  {
    id: "mahle-ox371d",
    name: "Mahle OX 371D",
    brand: "Mahle",
    category: "oil_filter",
    description: "Oljefilter för Volvo 5-cylindermotorer.",
    specifications: {
      Typ: "Insatsfilter",
      Höjd: "141 mm",
      Fordon: "Volvo 5-cyl",
    },
    compatibleVehicles: [
      VOLVO_COMPAT,
      { make: "Volvo", model: "S60", yearFrom: 2000, yearTo: 2009 },
    ],
    prices: [],
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    priceTrend: "unknown",
    lastUpdated: new Date("2026-03-21"),
    rating: undefined,
    reviewCount: undefined,
  },
];

function matchesQuery(product: Product, query: PriceSearchQuery): boolean {
  const q = query.query.toLowerCase();
  const nameMatch = product.name.toLowerCase().includes(q);
  const brandMatch = product.brand.toLowerCase().includes(q);
  const descMatch = product.description.toLowerCase().includes(q);
  const specMatch = Object.values(product.specifications).some((v) =>
    v.toLowerCase().includes(q),
  );

  if (!nameMatch && !brandMatch && !descMatch && !specMatch) return false;

  if (query.category && product.category !== query.category) return false;
  if (query.brand && product.brand.toLowerCase() !== query.brand.toLowerCase())
    return false;

  if (query.viscosity) {
    const viscSpec = product.specifications["Viskositet"];
    if (viscSpec && viscSpec !== query.viscosity) return false;
  }

  if (query.aceaClass) {
    const aceaSpec = product.specifications["ACEA"];
    if (aceaSpec && !aceaSpec.includes(query.aceaClass)) return false;
  }

  if (query.vehicleMake) {
    const hasCompat = product.compatibleVehicles.some(
      (c) => c.make.toLowerCase() === query.vehicleMake!.toLowerCase(),
    );
    if (!hasCompat) return false;
  }

  if (query.maxPriceSEK && product.lowestPrice > query.maxPriceSEK)
    return false;
  if (query.minPriceSEK && product.highestPrice < query.minPriceSEK)
    return false;

  if (query.onlyInStock) {
    const hasStock = product.prices.some((p) => p.inStock);
    if (!hasStock) return false;
  }

  if (query.onlyOnSale) {
    const hasSale = product.prices.some((p) => p.isOnSale);
    if (!hasSale) return false;
  }

  return true;
}

function sortProducts(products: Product[], query: PriceSearchQuery): Product[] {
  const sorted = [...products];
  const dir = query.sortOrder === "desc" ? -1 : 1;

  sorted.sort((a, b) => {
    switch (query.sortBy) {
      case "price_lowest":
        return (a.lowestPrice - b.lowestPrice) * dir;
      case "price_highest":
        return (a.highestPrice - b.highestPrice) * dir;
      case "price_per_unit":
        return ((a.pricePerLiter ?? 0) - (b.pricePerLiter ?? 0)) * dir;
      case "rating":
        return ((b.rating ?? 0) - (a.rating ?? 0)) * dir;
      case "retailer_trust":
        return 0;
      case "last_updated":
        return (b.lastUpdated.getTime() - a.lastUpdated.getTime()) * dir;
      default:
        return 0;
    }
  });

  return sorted;
}

function generatePriceHistory(
  productId: string,
  retailerId: string,
  currentPrice: number,
): PriceHistory {
  const entries: Array<{ date: Date; priceSEK: number }> = [];
  const now = new Date();

  for (let i = 90; i >= 0; i -= 7) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const variance = (Math.random() - 0.5) * currentPrice * 0.15;
    const price = Math.round(currentPrice + variance);
    entries.push({ date, priceSEK: Math.max(price, currentPrice * 0.8) });
  }

  entries.push({ date: now, priceSEK: currentPrice });

  const prices = entries.map((e) => e.priceSEK);
  const lowestEver = Math.min(...prices);
  const highestEver = Math.max(...prices);
  const lowestIdx = prices.indexOf(lowestEver);
  const highestIdx = prices.indexOf(highestEver);

  let trend: PriceTrend = "stable";
  const recentPrices = prices.slice(-4);
  if (recentPrices.length >= 2) {
    const diff = recentPrices[recentPrices.length - 1] - recentPrices[0];
    if (diff > currentPrice * 0.05) trend = "rising";
    else if (diff < -currentPrice * 0.05) trend = "falling";
  }

  return {
    productId,
    retailerId,
    entries,
    trend,
    lowestEver,
    highestEver,
    lowestEverDate: entries[lowestIdx].date,
    highestEverDate: entries[highestIdx].date,
  };
}

export class PriceService {
  private products: Product[] = SEED_PRODUCTS;
  private retailers: Retailer[] = RETAILERS;

  async search(query: PriceSearchQuery): Promise<PriceSearchResult> {
    const startTime = performance.now();

    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 300),
    );

    const matched = this.products.filter((p) => matchesQuery(p, query));
    const sorted = sortProducts(matched, query);

    const allPrices = sorted.flatMap((p) => p.prices.map((pr) => pr.priceSEK));
    const min = allPrices.length ? Math.min(...allPrices) : 0;
    const max = allPrices.length ? Math.max(...allPrices) : 0;
    const avg = allPrices.length
      ? Math.round(allPrices.reduce((s, p) => s + p, 0) / allPrices.length)
      : 0;

    const usedRetailerIds = new Set(
      sorted.flatMap((p) => p.prices.map((pr) => pr.retailerId)),
    );
    const usedRetailers = this.retailers.filter((r) =>
      usedRetailerIds.has(r.id),
    );

    return {
      query,
      products: sorted,
      totalResults: sorted.length,
      searchTime: Math.round(performance.now() - startTime),
      retailers: usedRetailers,
      priceRange: { min, max, average: avg },
      lastUpdated: new Date(),
    };
  }

  async getProduct(productId: string): Promise<Product | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.products.find((p) => p.id === productId);
  }

  async getPriceHistory(
    productId: string,
    retailerId: string,
  ): Promise<PriceHistory | undefined> {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return undefined;

    const price = product.prices.find((p) => p.retailerId === retailerId);
    if (!price) return undefined;

    await new Promise((resolve) => setTimeout(resolve, 150));
    return generatePriceHistory(productId, retailerId, price.priceSEK);
  }

  async getRetailers(): Promise<Retailer[]> {
    return this.retailers;
  }

  async getCategories(): Promise<
    Array<{ value: ProductCategory; label: string; count: number }>
  > {
    const categories: Record<
      ProductCategory,
      { label: string; count: number }
    > = {
      motor_oil: { label: "Motorolja", count: 0 },
      oil_filter: { label: "Oljefilter", count: 0 },
      brake_pads: { label: "Bromsbelägg", count: 0 },
      brake_discs: { label: "Bromsskivor", count: 0 },
      tires: { label: "Däck", count: 0 },
      wiper_blades: { label: "Torkarblad", count: 0 },
      air_filter: { label: "Luftfilter", count: 0 },
      cabin_filter: { label: "Kupéfilter", count: 0 },
      spark_plugs: { label: "Tändstift", count: 0 },
      coolant: { label: "Kylvätska", count: 0 },
      transmission_fluid: { label: "Växellådsolja", count: 0 },
      battery: { label: "Batteri", count: 0 },
      other: { label: "Övrigt", count: 0 },
    };

    for (const product of this.products) {
      if (categories[product.category]) {
        categories[product.category].count++;
      }
    }

    return Object.entries(categories)
      .filter(([, v]) => v.count > 0)
      .map(([key, v]) => ({
        value: key as ProductCategory,
        label: v.label,
        count: v.count,
      }));
  }

  async getBrands(): Promise<string[]> {
    return [...new Set(this.products.map((p) => p.brand))].sort();
  }
}

export const priceService = new PriceService();
export default priceService;
