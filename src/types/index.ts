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
