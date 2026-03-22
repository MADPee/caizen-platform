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
    url: `${retailer.url}/product/${productId}`,
    lastVerified: new Date(),
    pricePerUnit: opts.pricePerUnit ?? priceSEK / parseFloat(unitSize),
    unitSize,
  };
}

const SEED_PRODUCTS: Product[] = [
  {
    id: "valvoline-maxlife-5w40-4l",
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
    prices: [
      makePrice("vml-ak24-4l", "valvoline-maxlife-5w40-4l", "ak24", 390, "4", {
        inStock: true,
        stockQuantity: 12,
      }),
      makePrice(
        "vml-skruvat-4l",
        "valvoline-maxlife-5w40-4l",
        "skruvat",
        404,
        "4",
      ),
      makePrice(
        "vml-mekonomen-4l",
        "valvoline-maxlife-5w40-4l",
        "mekonomen",
        459,
        "4",
      ),
      makePrice(
        "vml-autoexp-4l",
        "valvoline-maxlife-5w40-4l",
        "autoexperten",
        435,
        "4",
      ),
    ],
    lowestPrice: 390,
    highestPrice: 459,
    averagePrice: 422,
    pricePerLiter: 97.5,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.6,
    reviewCount: 342,
  },
  {
    id: "valvoline-maxlife-5w40-1l",
    name: "Valvoline MaxLife Synthetic 5W-40 (1L)",
    brand: "Valvoline",
    category: "motor_oil",
    description:
      "Helsyntetisk high-mileage motorolja med tätningskonditionerare. 1-liters förpackning.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B4",
      API: "SN/CF",
      "High Mileage": "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [
      makePrice("vml-ak24-1l", "valvoline-maxlife-5w40-1l", "ak24", 121, "1"),
      makePrice(
        "vml-skruvat-1l",
        "valvoline-maxlife-5w40-1l",
        "skruvat",
        139,
        "1",
      ),
      makePrice(
        "vml-mekonomen-1l",
        "valvoline-maxlife-5w40-1l",
        "mekonomen",
        158,
        "1",
      ),
    ],
    lowestPrice: 121,
    highestPrice: 158,
    averagePrice: 139,
    pricePerLiter: 121,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.6,
    reviewCount: 189,
  },
  {
    id: "castrol-edge-5w40-4l",
    name: "Castrol EDGE 5W-40 A3/B4",
    brand: "Castrol",
    category: "motor_oil",
    description:
      "Helsyntetisk premiumolja med PowerBoost Technology. Minskar beläggningar i turbo och ger 30% bättre prestanda än industrikrav.",
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
    prices: [
      makePrice("ce-ak24-4l", "castrol-edge-5w40-4l", "ak24", 445, "4", {
        isOnSale: true,
        salePercentage: 18,
        originalPrice: 537,
      }),
      makePrice("ce-weboil-4l", "castrol-edge-5w40-4l", "weboil", 496, "4"),
      makePrice("ce-biltema-4l", "castrol-edge-5w40-4l", "biltema", 549, "4"),
      makePrice(
        "ce-mekonomen-4l",
        "castrol-edge-5w40-4l",
        "mekonomen",
        599,
        "4",
      ),
      makePrice("ce-motonet-4l", "castrol-edge-5w40-4l", "motonet", 579, "4"),
      makePrice("ce-skruvat-4l", "castrol-edge-5w40-4l", "skruvat", 520, "4"),
    ],
    lowestPrice: 445,
    highestPrice: 599,
    averagePrice: 531,
    pricePerLiter: 111,
    priceTrend: "falling",
    lastUpdated: new Date(),
    rating: 4.7,
    reviewCount: 876,
  },
  {
    id: "castrol-edge-5w40-1l",
    name: "Castrol EDGE 5W-40 A3/B4 (1L)",
    brand: "Castrol",
    category: "motor_oil",
    description:
      "Helsyntetisk premiumolja med PowerBoost Technology. 1-liters förpackning.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B4",
      API: "SP",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [
      makePrice("ce-weboil-1l", "castrol-edge-5w40-1l", "weboil", 149, "1", {
        isOnSale: true,
        salePercentage: 15,
        originalPrice: 175,
      }),
      makePrice("ce-skruvat-1l", "castrol-edge-5w40-1l", "skruvat", 195, "1"),
      makePrice(
        "ce-mekonomen-1l",
        "castrol-edge-5w40-1l",
        "mekonomen",
        219,
        "1",
      ),
    ],
    lowestPrice: 149,
    highestPrice: 219,
    averagePrice: 188,
    pricePerLiter: 149,
    priceTrend: "falling",
    lastUpdated: new Date(),
    rating: 4.7,
    reviewCount: 512,
  },
  {
    id: "liquimoly-ht-5w40-5l",
    name: "Liqui Moly Leichtlauf High Tech 5W-40",
    brand: "Liqui Moly",
    category: "motor_oil",
    description:
      "Helsyntetisk lågfriktions-motorolja av högsta kvalitet. Utmärkt slitageskydd och shear-stabilitet för turbomotorer.",
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
    prices: [
      makePrice("lm-skruvat-5l", "liquimoly-ht-5w40-5l", "skruvat", 669, "5"),
      makePrice("lm-ak24-5l", "liquimoly-ht-5w40-5l", "ak24", 645, "5"),
      makePrice(
        "lm-mekonomen-5l",
        "liquimoly-ht-5w40-5l",
        "mekonomen",
        729,
        "5",
      ),
      makePrice(
        "lm-autoexp-5l",
        "liquimoly-ht-5w40-5l",
        "autoexperten",
        699,
        "5",
      ),
    ],
    lowestPrice: 645,
    highestPrice: 729,
    averagePrice: 685,
    pricePerLiter: 129,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.5,
    reviewCount: 567,
  },
  {
    id: "liquimoly-ht-5w40-1l",
    name: "Liqui Moly Leichtlauf High Tech 5W-40 (1L)",
    brand: "Liqui Moly",
    category: "motor_oil",
    description: "Helsyntetisk lågfriktions-motorolja. 1-liters förpackning.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk",
      ACEA: "A3/B4",
      API: "SP",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [
      makePrice("lm-winparts-1l", "liquimoly-ht-5w40-1l", "weboil", 121, "1"),
      makePrice("lm-skruvat-1l", "liquimoly-ht-5w40-1l", "skruvat", 165, "1"),
      makePrice(
        "lm-mekonomen-1l",
        "liquimoly-ht-5w40-1l",
        "mekonomen",
        179,
        "1",
      ),
    ],
    lowestPrice: 121,
    highestPrice: 179,
    averagePrice: 155,
    pricePerLiter: 121,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.5,
    reviewCount: 298,
  },
  {
    id: "mobil1-fs-5w40-5l",
    name: "Mobil 1 FS 5W-40",
    brand: "Mobil",
    category: "motor_oil",
    description:
      "Avancerad helsyntetisk motorolja med exceptionell rengöringsförmåga. Lämplig för bilar med högt miltal.",
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
    prices: [
      makePrice("m1-weboil-5l", "mobil1-fs-5w40-5l", "weboil", 743, "5"),
      makePrice("m1-biltema-5l", "mobil1-fs-5w40-5l", "biltema", 799, "5"),
      makePrice("m1-mekonomen-5l", "mobil1-fs-5w40-5l", "mekonomen", 849, "5"),
    ],
    lowestPrice: 743,
    highestPrice: 849,
    averagePrice: 797,
    pricePerLiter: 149,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.8,
    reviewCount: 1203,
  },
  {
    id: "liquimoly-mos2-10w40-5l",
    name: "Liqui Moly MoS2 Leichtlauf 10W-40",
    brand: "Liqui Moly",
    category: "motor_oil",
    description:
      "Halvsyntetisk motorolja med MoS2-tillsats (molybdendisulfid) för extra slitskydd. Budget-val för äldre motorer.",
    specifications: {
      Viskositet: "10W-40",
      Typ: "Halvsyntetisk",
      ACEA: "A3/B4",
      API: "SL/CF",
      MoS2: "Ja",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [
      makePrice("lmm-ak24-5l", "liquimoly-mos2-10w40-5l", "ak24", 329, "5"),
      makePrice(
        "lmm-skruvat-5l",
        "liquimoly-mos2-10w40-5l",
        "skruvat",
        359,
        "5",
      ),
      makePrice(
        "lmm-biltema-5l",
        "liquimoly-mos2-10w40-5l",
        "biltema",
        349,
        "5",
      ),
      makePrice("lmm-weboil-5l", "liquimoly-mos2-10w40-5l", "weboil", 339, "5"),
    ],
    lowestPrice: 329,
    highestPrice: 359,
    averagePrice: 344,
    pricePerLiter: 66,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.3,
    reviewCount: 421,
  },
  {
    id: "biltema-5w40-10l",
    name: "Biltema Helsyntetisk 5W-40 (10L)",
    brand: "Biltema",
    category: "motor_oil",
    description:
      "Biltemas egna helsyntetiska motorolja. 10-liters dunk med imponerande OEM-godkännanden: MB 229.3/229.5, BMW LL-01, VW 502/505. Bäst literpris.",
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
      makePrice("bt-biltema-10l", "biltema-5w40-10l", "biltema", 649, "10"),
    ],
    lowestPrice: 649,
    highestPrice: 649,
    averagePrice: 649,
    pricePerLiter: 65,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.2,
    reviewCount: 94,
  },
  {
    id: "biltema-5w40-4l",
    name: "Biltema Helsyntetisk 5W-40 (4L)",
    brand: "Biltema",
    category: "motor_oil",
    description:
      "Biltemas helsyntetiska motorolja, 4-liters dunk. Samma OEM-godkännanden som 10L-versionen.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk (Fully Synthetic)",
      ACEA: "A3/B3, A3/B4",
      API: "SN, SL, CF",
      Artikelnummer: "34-879",
      "MB 229.3/229.5": "Ja",
      "BMW LL-98/LL-01": "Ja",
      "VW 502.00/505.00": "Ja",
      "High Mileage": "Nej",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [
      makePrice("bt-biltema-4l", "biltema-5w40-4l", "biltema", 319, "4"),
    ],
    lowestPrice: 319,
    highestPrice: 319,
    averagePrice: 319,
    pricePerLiter: 80,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.2,
    reviewCount: 118,
  },
  {
    id: "biltema-5w40-1l",
    name: "Biltema Helsyntetisk 5W-40 (1L)",
    brand: "Biltema",
    category: "motor_oil",
    description:
      "Biltemas helsyntetiska motorolja, 1-liters förpackning. Praktisk för påfyllning.",
    specifications: {
      Viskositet: "5W-40",
      Typ: "Helsyntetisk (Fully Synthetic)",
      ACEA: "A3/B3, A3/B4",
      API: "SN, SL, CF",
      Artikelnummer: "34-878",
      "High Mileage": "Nej",
    },
    compatibleVehicles: GENERIC_COMPAT,
    prices: [makePrice("bt-biltema-1l", "biltema-5w40-1l", "biltema", 99, "1")],
    lowestPrice: 99,
    highestPrice: 99,
    averagePrice: 99,
    pricePerLiter: 99,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.2,
    reviewCount: 63,
  },
  {
    id: "mann-hu719-8x",
    name: "Mann-Filter HU 719/8 x",
    brand: "Mann-Filter",
    category: "oil_filter",
    description:
      "Premium oljefilter för Volvo 5-cylindermotorer. OE-kvalitet med hög filterkapacitet.",
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
    prices: [
      makePrice("mf-skruvat", "mann-hu719-8x", "skruvat", 79, "1"),
      makePrice("mf-ak24", "mann-hu719-8x", "ak24", 72, "1"),
      makePrice("mf-mekonomen", "mann-hu719-8x", "mekonomen", 89, "1"),
      makePrice("mf-biltema", "mann-hu719-8x", "biltema", 85, "1"),
    ],
    lowestPrice: 72,
    highestPrice: 89,
    averagePrice: 81,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.8,
    reviewCount: 654,
  },
  {
    id: "mahle-ox371d",
    name: "Mahle OX 371D",
    brand: "Mahle",
    category: "oil_filter",
    description: "Kvalitetsfilter från Mahle. Passar Volvo 5-cylindermotorer.",
    specifications: {
      Typ: "Insatsfilter",
      Höjd: "141 mm",
      Fordon: "Volvo 5-cyl",
    },
    compatibleVehicles: [
      VOLVO_COMPAT,
      { make: "Volvo", model: "S60", yearFrom: 2000, yearTo: 2009 },
    ],
    prices: [
      makePrice("mh-biltema", "mahle-ox371d", "biltema", 69, "1"),
      makePrice("mh-mekonomen", "mahle-ox371d", "mekonomen", 85, "1"),
      makePrice("mh-skruvat", "mahle-ox371d", "skruvat", 75, "1"),
    ],
    lowestPrice: 69,
    highestPrice: 85,
    averagePrice: 76,
    priceTrend: "stable",
    lastUpdated: new Date(),
    rating: 4.6,
    reviewCount: 312,
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
