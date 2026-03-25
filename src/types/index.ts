// src/types/index.ts
/**
 * CaiZen Platform - Core Type Definitions
 * Datum: 2025-09-28
 * Version: 2.0
 */

// ====================================
// SÄKERHET & PRIVACY TYPES
// ====================================

export interface MaskedIdentifier {
  readonly masked: string;
  readonly hash: string; // För jämförelser utan att exponera data
  readonly verified: boolean;
}

export interface PrivacySettings {
  readonly allowMarketplaceSharing: boolean;
  readonly allowCommunityParticipation: boolean;
  readonly allowAnonymizedAnalytics: boolean;
  readonly dataRetentionConsent: boolean;
  readonly lastUpdated: Date;
}

export interface GDPRRequest {
  readonly id: string;
  readonly userId: string;
  readonly type: "export" | "delete" | "rectification" | "restriction";
  readonly status: "pending" | "processing" | "completed" | "failed";
  readonly requestDate: Date;
  readonly completionDate?: Date;
  readonly data?: unknown;
}

// ====================================
// FORDON TYPES
// ====================================

export interface Vehicle {
  readonly id: string;
  readonly userId: string;

  // Säker fordonsidentifiering
  readonly registration: MaskedIdentifier;
  readonly vin: MaskedIdentifier;

  // Grundläggande fordonsdata
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly color: string;
  readonly fuelType: FuelType;
  readonly engineSize?: number;
  readonly transmission: "manual" | "automatic" | "cvt";

  // Status och verifiering
  readonly verificationLevel: VerificationLevel;
  readonly status: VehicleStatus;
  readonly healthScore: number; // 0-100

  // Metadata
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastInspection?: Date;
  readonly nextInspection?: Date;
}

export type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "hybrid"
  | "plugin-hybrid"
  | "ethanol"
  | "gas";

export type VerificationLevel =
  | "unverified" // 0% - Endast grunddata
  | "basic" // 25% - VIN verifierad
  | "documented" // 50% - Servicehistorik finns
  | "verified" // 75% - Tredjepartsverifiering
  | "certified"; // 100% - Fullständig verifiering

export type VehicleStatus =
  | "active"
  | "sold"
  | "archived"
  | "for_sale"
  | "under_repair";

// ====================================
// BRÄNSLE & FÖRBRUKNING TYPES
// ====================================

export interface FuelEntry {
  readonly id: string;
  readonly vehicleId: string;
  readonly date: Date;
  readonly time: string;
  readonly station: string;
  readonly fuelType: FuelType;
  readonly amount: number; // Liter för bränsle, kWh för el
  readonly pricePerUnit: number;
  readonly totalCost: number;
  readonly odometerReading: number;
  readonly location?: GeographicCoordinate;
  readonly receipt?: DocumentReference;
  readonly createdAt: Date;
}

export interface FuelStatistics {
  readonly vehicleId: string;
  readonly period: TimePeriod;
  readonly averageConsumption: number; // L/100km eller kWh/100km
  readonly totalCost: number;
  readonly totalFuel: number;
  readonly totalDistance: number;
  readonly co2Emissions: number; // kg CO2
  readonly costPerKm: number;
  readonly efficiency: {
    readonly city: number;
    readonly highway: number;
    readonly mixed: number;
  };
}

export interface TimePeriod {
  readonly start: Date;
  readonly end: Date;
  readonly type: "day" | "week" | "month" | "quarter" | "year" | "custom";
}

// ====================================
// RESA & ANALYS TYPES
// ====================================

export interface Trip {
  readonly id: string;
  readonly vehicleId: string;
  readonly name: string;
  readonly status: "ongoing" | "completed" | "planned";
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly startLocation: GeographicCoordinate;
  readonly endLocation?: GeographicCoordinate;
  readonly route?: GeographicCoordinate[];
  readonly distance: number; // km
  readonly duration?: number; // minuter
  readonly averageSpeed: number; // km/h
  readonly fuelConsumption: number;
  readonly cost: number;
  readonly weather?: WeatherCondition[];
  readonly stops: TripStop[];
  readonly createdAt: Date;
}

export interface TripStop {
  readonly id: string;
  readonly location: GeographicCoordinate;
  readonly name: string;
  readonly arrivalTime: Date;
  readonly departureTime?: Date;
  readonly type: "fuel" | "rest" | "destination" | "service" | "waypoint";
  readonly notes?: string;
  readonly fuelEntry?: string; // FuelEntry ID om det var en tankning
}

export interface GeographicCoordinate {
  readonly latitude: number;
  readonly longitude: number;
  readonly accuracy?: number; // meter
  readonly altitude?: number; // meter
  readonly timestamp?: Date;
}

export interface WeatherCondition {
  readonly timestamp: Date;
  readonly temperature: number; // Celsius
  readonly conditions:
    | "sunny"
    | "cloudy"
    | "rainy"
    | "snowy"
    | "foggy"
    | "windy";
  readonly windSpeed?: number; // m/s
  readonly humidity?: number; // %
  readonly pressure?: number; // hPa
}

// ====================================
// MARKNADSPLATS TYPES
// ====================================

export interface MarketplaceListing {
  readonly id: string;
  readonly vehicleId: string;
  readonly sellerId: string;
  readonly status: MarketplaceStatus;
  readonly price: number;
  readonly currency: "SEK" | "EUR" | "USD";
  readonly description: string;
  readonly images: ImageReference[];
  readonly location: GeographicCoordinate;
  readonly locationDescription: string; // "Stockholm län" - aldrig exakt adress
  readonly verificationBadges: VerificationBadge[];
  readonly viewCount: number;
  readonly contactCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expiresAt: Date;
  readonly featured: boolean;
  readonly highlightedFeatures: string[];
}

export type MarketplaceStatus =
  | "draft"
  | "active"
  | "pending_review"
  | "sold"
  | "expired"
  | "suspended";

export interface VerificationBadge {
  readonly type:
    | "service_history"
    | "inspection_passed"
    | "low_mileage"
    | "one_owner"
    | "accident_free";
  readonly verified: boolean;
  readonly verifiedAt?: Date;
  readonly verifiedBy?: string;
  readonly confidence: number; // 0-100
}

export interface MarketplaceSearch {
  readonly query?: string;
  readonly location: GeographicCoordinate;
  readonly radius: number; // km
  readonly filters: SearchFilters;
  readonly sortBy: SortOption;
  readonly sortOrder: "asc" | "desc";
  readonly limit: number;
  readonly offset: number;
}

export interface SearchFilters {
  readonly priceRange?: { min: number; max: number };
  readonly yearRange?: { min: number; max: number };
  readonly mileageRange?: { min: number; max: number };
  readonly makes?: string[];
  readonly models?: string[];
  readonly fuelTypes?: FuelType[];
  readonly transmissions?: string[];
  readonly verificationLevel?: VerificationLevel[];
  readonly healthScoreMin?: number;
  readonly hasServiceHistory?: boolean;
  readonly hasInspection?: boolean;
}

export type SortOption =
  | "price"
  | "year"
  | "mileage"
  | "distance"
  | "health_score"
  | "verification_level"
  | "created_at";

// ====================================
// COMMUNITY TYPES
// ====================================

export interface VehicleGroup {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly make: string;
  readonly model?: string;
  readonly generation?: string;
  readonly memberCount: number;
  readonly postCount: number;
  readonly moderators: string[];
  readonly rules: string[];
  readonly createdAt: Date;
  readonly isPrivate: boolean;
  readonly requiresApproval: boolean;
}

export interface CommunityPost {
  readonly id: string;
  readonly groupId: string;
  readonly authorId: string;
  readonly title: string;
  readonly content: string;
  readonly type: PostType;
  readonly tags: string[];
  readonly images: ImageReference[];
  readonly attachments: DocumentReference[];
  readonly likeCount: number;
  readonly commentCount: number;
  readonly viewCount: number;
  readonly isPinned: boolean;
  readonly isFeatured: boolean;
  readonly moderationStatus: ModerationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expiresAt?: Date;
}

export type PostType =
  | "discussion"
  | "question"
  | "showcase"
  | "maintenance_tip"
  | "problem_solving"
  | "marketplace_discussion"
  | "event_announcement";

export type ModerationStatus =
  | "approved"
  | "pending"
  | "flagged"
  | "removed"
  | "auto_moderated";

export interface CommunityComment {
  readonly id: string;
  readonly postId: string;
  readonly authorId: string;
  readonly content: string;
  readonly parentCommentId?: string;
  readonly likeCount: number;
  readonly moderationStatus: ModerationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ====================================
// DOKUMENT & OCR TYPES
// ====================================

export interface DocumentReference {
  readonly id: string;
  readonly vehicleId?: string;
  readonly userId: string;
  readonly type: DocumentType;
  readonly name: string;
  readonly mimeType: string;
  readonly size: number;
  readonly url: string;
  readonly thumbnailUrl?: string;
  readonly ocrData?: OCRResult;
  readonly uploadedAt: Date;
  readonly expiresAt?: Date;
  readonly privacyLevel: PrivacyLevel;
}

export type DocumentType =
  | "inspection_report"
  | "service_receipt"
  | "fuel_receipt"
  | "insurance_document"
  | "registration_certificate"
  | "technical_data"
  | "warranty_document"
  | "accident_report"
  | "modification_certificate";

export type PrivacyLevel = "public" | "community" | "verified" | "private";

export interface OCRResult {
  readonly id: string;
  readonly documentId: string;
  readonly rawText: string;
  readonly extractedData: ExtractedData;
  readonly confidence: number;
  readonly processingTime: number;
  readonly engine: "tesseract" | "google_vision" | "aws_textract";
  readonly processedAt: Date;
  readonly manuallyReviewed: boolean;
  readonly reviewedBy?: string;
  readonly reviewedAt?: Date;
}

export interface ExtractedData {
  readonly personal: PersonalData;
  readonly vehicle: VehicleData;
  readonly service: ServiceData;
  readonly inspection: InspectionData;
  readonly financial: FinancialData;
}

export interface PersonalData {
  readonly name?: string;
  readonly address?: string;
  readonly personalNumber?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly confidence: number;
  readonly shouldRedact: boolean;
}

export interface VehicleData {
  readonly registration?: string;
  readonly vin?: string;
  readonly make?: string;
  readonly model?: string;
  readonly year?: number;
  readonly mileage?: number;
  readonly engineSize?: number;
  readonly confidence: number;
}

export interface ServiceData {
  readonly date?: Date;
  readonly workshop?: string;
  readonly serviceType?: string;
  readonly parts?: ServicePart[];
  readonly laborHours?: number;
  readonly totalCost?: number;
  readonly nextServiceDate?: Date;
  readonly confidence: number;
}

export interface ServicePart {
  readonly name: string;
  readonly partNumber?: string;
  readonly quantity: number;
  readonly price?: number;
  readonly warranty?: string;
}

export interface InspectionData {
  readonly date?: Date;
  readonly station?: string;
  readonly result?: "approved" | "conditional" | "failed";
  readonly mileage?: number;
  readonly nextInspection?: Date;
  readonly emissions?: EmissionData;
  readonly defects?: InspectionDefect[];
  readonly confidence: number;
}

export interface EmissionData {
  readonly co2?: number;
  readonly nox?: number;
  readonly particles?: number;
  readonly hc?: number;
  readonly co?: number;
  readonly lambda?: number;
}

export interface InspectionDefect {
  readonly severity: "minor" | "major" | "dangerous";
  readonly category: string;
  readonly description: string;
  readonly mustFix: boolean;
  readonly fixDate?: Date;
}

export interface FinancialData {
  readonly amount?: number;
  readonly currency?: string;
  readonly date?: Date;
  readonly paymentMethod?: string;
  readonly taxAmount?: number;
  readonly confidence: number;
}

export interface ImageReference {
  readonly id: string;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly size: number;
  readonly mimeType: string;
  readonly uploadedAt: Date;
  readonly privacyLevel: PrivacyLevel;
}

// ====================================
// API & RESPONSE TYPES
// ====================================

export interface APIResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: APIError;
  readonly meta?: ResponseMeta;
}

export interface APIError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
  readonly timestamp: Date;
}

export interface ResponseMeta {
  readonly total?: number;
  readonly page?: number;
  readonly limit?: number;
  readonly hasMore?: boolean;
  readonly processingTime?: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  readonly meta: Required<ResponseMeta>;
}

// ====================================
// USER & AUTH TYPES
// ====================================

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
  readonly privacySettings: PrivacySettings;
  readonly preferences: UserPreferences;
  readonly verificationLevel: UserVerificationLevel;
  readonly createdAt: Date;
  readonly lastLoginAt: Date;
  readonly isActive: boolean;
}

export type UserVerificationLevel =
  | "unverified"
  | "email_verified"
  | "phone_verified"
  | "id_verified"
  | "fully_verified";

export interface UserPreferences {
  readonly language: "sv" | "en" | "no" | "dk";
  readonly currency: "SEK" | "EUR" | "NOK" | "DKK";
  readonly units: "metric" | "imperial";
  readonly notifications: NotificationSettings;
  readonly theme: "dark" | "light" | "auto";
}

export interface NotificationSettings {
  readonly email: boolean;
  readonly push: boolean;
  readonly sms: boolean;
  readonly marketplace: boolean;
  readonly community: boolean;
  readonly maintenance: boolean;
  readonly security: boolean;
}

// ====================================
// UTILITY TYPES
// ====================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type CreateType<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type UpdateType<T> = PartialExcept<
  Omit<T, "id" | "createdAt" | "updatedAt">,
  never
>;

// ====================================
// UNDERHÅLL & REKOMMENDATION TYPES
// ====================================

export type MaintenanceCategory =
  | "oil_change"
  | "brake_service"
  | "tire_rotation"
  | "timing_belt"
  | "coolant_flush"
  | "transmission_service"
  | "pcv_service"
  | "spark_plugs"
  | "general_inspection";

export type OilViscosity =
  | "0W-20"
  | "0W-30"
  | "5W-30"
  | "5W-40"
  | "10W-40"
  | "15W-50";

export type OilType = "full_synthetic" | "semi_synthetic" | "mineral";

export type ACEAClass = "A1/B1" | "A3/B3" | "A3/B4" | "A5/B5" | "C2" | "C3";

export interface OilRecommendation {
  readonly brand: string;
  readonly product: string;
  readonly viscosity: OilViscosity;
  readonly oilType: OilType;
  readonly aceaClass: ACEAClass;
  readonly apiRating: string;
  readonly highMileage: boolean;
  readonly sealConditioner: boolean;
  readonly estimatedPriceSEK: {
    readonly min: number;
    readonly max: number;
    readonly per: "liter" | "5L";
  };
  readonly pros: string[];
  readonly cons: string[];
  readonly rating: number;
}

export interface MaintenanceRecommendation {
  readonly id: string;
  readonly vehicleId: string;
  readonly category: MaintenanceCategory;
  readonly title: string;
  readonly description: string;
  readonly urgency: "low" | "medium" | "high" | "critical";
  readonly basedOnMileage: number;
  readonly basedOnVehicleAge: number;
  readonly recommendedInterval: {
    readonly km: number;
    readonly months: number;
  };
  readonly oilRecommendations?: OilRecommendation[];
  readonly estimatedCostSEK: {
    readonly min: number;
    readonly max: number;
  };
  readonly relatedIssues: string[];
  readonly sources: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MaintenanceSchedule {
  readonly vehicleId: string;
  readonly recommendations: MaintenanceRecommendation[];
  readonly nextServiceDate: Date;
  readonly nextServiceMileage: number;
  readonly overallHealthScore: number;
  readonly warnings: string[];
}

// ====================================
// PRISINDEXERING & PRISJÄMFÖRELSE TYPES
// ====================================

export type ProductCategory =
  | "motor_oil"
  | "oil_filter"
  | "brake_pads"
  | "brake_discs"
  | "tires"
  | "wiper_blades"
  | "air_filter"
  | "cabin_filter"
  | "spark_plugs"
  | "coolant"
  | "transmission_fluid"
  | "battery"
  | "other";

export type RetailerType = "online" | "physical" | "both";

export type PriceTrend = "rising" | "stable" | "falling" | "unknown";

export type Currency = "SEK" | "EUR" | "NOK" | "DKK";

export interface Retailer {
  readonly id: string;
  readonly name: string;
  readonly url?: string;
  readonly type: RetailerType;
  readonly logoUrl?: string;
  readonly country: "SE" | "NO" | "DK" | "FI" | "DE";
  readonly shippingCostSEK?: number;
  readonly freeShippingThresholdSEK?: number;
  readonly pickupAvailable: boolean;
  readonly pickupTimeHours?: number;
  readonly trustScore: number;
  readonly reviewCount: number;
}

export interface PriceEntry {
  readonly id: string;
  readonly productId: string;
  readonly retailerId: string;
  readonly retailer: Retailer;
  readonly priceSEK: number;
  readonly originalPrice?: number;
  readonly currency: Currency;
  readonly isOnSale: boolean;
  readonly salePercentage?: number;
  readonly inStock: boolean;
  readonly stockQuantity?: number;
  readonly url: string;
  readonly lastVerified: Date;
  readonly pricePerUnit?: number;
  readonly unitSize: string;
  readonly verified: boolean;
  readonly verifiedSource?: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly category: ProductCategory;
  readonly description: string;
  readonly specifications: Record<string, string>;
  readonly imageUrl?: string;
  readonly ean?: string;
  readonly partNumber?: string;
  readonly compatibleVehicles: VehicleCompatibility[];
  readonly prices: PriceEntry[];
  readonly lowestPrice: number;
  readonly highestPrice: number;
  readonly averagePrice: number;
  readonly pricePerLiter?: number;
  readonly priceTrend: PriceTrend;
  readonly lastUpdated: Date;
  readonly rating?: number;
  readonly reviewCount?: number;
}

export interface VehicleCompatibility {
  readonly make: string;
  readonly model?: string;
  readonly yearFrom?: number;
  readonly yearTo?: number;
  readonly engineCode?: string;
}

export interface PriceSearchQuery {
  readonly query: string;
  readonly category?: ProductCategory;
  readonly brand?: string;
  readonly vehicleMake?: string;
  readonly vehicleModel?: string;
  readonly vehicleYear?: number;
  readonly engineCode?: string;
  readonly viscosity?: OilViscosity;
  readonly aceaClass?: ACEAClass;
  readonly maxPriceSEK?: number;
  readonly minPriceSEK?: number;
  readonly onlyInStock?: boolean;
  readonly onlyOnSale?: boolean;
  readonly sortBy: PriceSortOption;
  readonly sortOrder: "asc" | "desc";
  readonly retailers?: string[];
  readonly country?: "SE" | "NO" | "DK" | "FI" | "DE";
}

export type PriceSortOption =
  | "price_lowest"
  | "price_highest"
  | "price_per_unit"
  | "rating"
  | "relevance"
  | "retailer_trust"
  | "last_updated";

export interface PriceSearchResult {
  readonly query: PriceSearchQuery;
  readonly products: Product[];
  readonly totalResults: number;
  readonly searchTime: number;
  readonly retailers: Retailer[];
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
    readonly average: number;
  };
  readonly lastUpdated: Date;
}

export interface PriceAlert {
  readonly id: string;
  readonly userId: string;
  readonly productId: string;
  readonly targetPriceSEK: number;
  readonly currentPriceSEK: number;
  readonly isTriggered: boolean;
  readonly triggeredAt?: Date;
  readonly createdAt: Date;
  readonly active: boolean;
}

export interface PriceHistory {
  readonly productId: string;
  readonly retailerId: string;
  readonly entries: Array<{
    readonly date: Date;
    readonly priceSEK: number;
  }>;
  readonly trend: PriceTrend;
  readonly lowestEver: number;
  readonly highestEver: number;
  readonly lowestEverDate: Date;
  readonly highestEverDate: Date;
}

// ====================================
// INKÖPSLISTA TYPES
// ====================================

export type ShoppingListItemStatus =
  | "pending"
  | "purchased"
  | "skipped"
  | "out_of_stock";

export interface ShoppingListItem {
  readonly id: string;
  readonly productId: string;
  readonly productName: string;
  readonly brand: string;
  readonly category: ProductCategory;
  readonly specifications: Record<string, string>;
  readonly selectedRetailerId: string;
  readonly selectedRetailerName: string;
  readonly selectedPriceSEK: number;
  readonly quantity: number;
  readonly unitSize: string;
  readonly totalPriceSEK: number;
  readonly url: string;
  readonly articleNumber?: string;
  readonly status: ShoppingListItemStatus;
  readonly notes?: string;
  readonly addedAt: Date;
  readonly purchasedAt?: Date;
  readonly vehicleId?: string;
  readonly vehicleName?: string;
}

export interface ShoppingList {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly vehicleId?: string;
  readonly vehicleName?: string;
  readonly items: ShoppingListItem[];
  readonly totalEstimatedCostSEK: number;
  readonly totalPurchasedCostSEK: number;
  readonly itemCount: number;
  readonly purchasedCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ====================================
// CONSTANTS
// ====================================

export const VERIFICATION_LEVELS = [
  "unverified",
  "basic",
  "documented",
  "verified",
  "certified",
] as const;

export const FUEL_TYPES = [
  "petrol",
  "diesel",
  "electric",
  "hybrid",
  "plugin-hybrid",
  "ethanol",
  "gas",
] as const;

export const PRIVACY_LEVELS = [
  "public",
  "community",
  "verified",
  "private",
] as const;
