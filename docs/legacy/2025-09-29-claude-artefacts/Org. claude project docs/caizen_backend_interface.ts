// src/lib/backend/interface.ts
/**
 * CaiZen Backend Client Interface
 * Provider-agnostic abstraction for Supabase ↔ Nhost
 * Version: 2.0
 */

import type { 
  User, 
  Vehicle, 
  FuelEntry, 
  MarketplaceListing,
  CreateType,
  UpdateType 
} from '@/types'

// ====================================
// CORE INTERFACES
// ====================================

export interface AuthClient {
  signUp(credentials: SignUpCredentials): Promise<AuthResult>
  signIn(credentials: SignInCredentials): Promise<AuthResult>
  signOut(): Promise<void>
  getSession(): Promise<Session | null>
  refreshSession(): Promise<Session | null>
  resetPassword(email: string): Promise<void>
  updatePassword(newPassword: string): Promise<void>
  onAuthStateChange(callback: (session: Session | null) => void): () => void
}

export interface DatabaseClient {
  // Generic CRUD
  query<T>(table: string, options?: QueryOptions): Promise<T[]>
  get<T>(table: string, id: string): Promise<T | null>
  insert<T>(table: string, data: Partial<T>): Promise<T>
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>
  delete(table: string, id: string): Promise<void>
  
  // Typed operations for main entities
  vehicles: {
    list(): Promise<Vehicle[]>
    get(id: string): Promise<Vehicle | null>
    create(data: CreateType<Vehicle>): Promise<Vehicle>
    update(id: string, data: UpdateType<Vehicle>): Promise<Vehicle>
    delete(id: string): Promise<void>
  }
  
  fuelEntries: {
    list(vehicleId: string): Promise<FuelEntry[]>
    create(data: CreateType<FuelEntry>): Promise<FuelEntry>
    delete(id: string): Promise<void>
  }
  
  marketplace: {
    list(filters?: MarketplaceFilters): Promise<MarketplaceListing[]>
    get(id: string): Promise<MarketplaceListing | null>
    create(data: CreateType<MarketplaceListing>): Promise<MarketplaceListing>
    update(id: string, data: UpdateType<MarketplaceListing>): Promise<MarketplaceListing>
    delete(id: string): Promise<void>
  }
}

export interface StorageClient {
  upload(bucket: string, path: string, file: File, options?: UploadOptions): Promise<StorageResult>
  download(bucket: string, path: string): Promise<Blob>
  delete(bucket: string, path: string): Promise<void>
  getPublicUrl(bucket: string, path: string): string
  createSignedUrl(bucket: string, path: string, expiresIn: number): Promise<string>
  list(bucket: string, path?: string): Promise<StorageObject[]>
}

export interface RealtimeClient {
  subscribe<T>(channel: string, callback: (payload: RealtimePayload<T>) => void): Subscription
  unsubscribe(subscription: Subscription): void
  channel(name: string): Channel
}

export interface FunctionsClient {
  invoke<T = any>(functionName: string, options?: InvokeOptions): Promise<T>
}

// ====================================
// MAIN BACKEND CLIENT
// ====================================

export interface BackendClient {
  readonly name: 'supabase' | 'nhost'
  readonly version: string
  
  auth: AuthClient
  db: DatabaseClient
  storage: StorageClient
  realtime: RealtimeClient
  functions: FunctionsClient
  
  // Provider-specific raw access (escape hatch)
  getProviderClient(): unknown
}

// ====================================
// SUPPORTING TYPES
// ====================================

export interface SignUpCredentials {
  email: string
  password: string
  metadata?: Record<string, any>
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface AuthResult {
  user: User | null
  session: Session | null
  error?: BackendError
}

export interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: User
}

export interface QueryOptions {
  filter?: Record<string, any>
  orderBy?: { column: string; ascending: boolean }
  limit?: number
  offset?: number
}

export interface MarketplaceFilters {
  query?: string
  priceRange?: { min: number; max: number }
  location?: { lat: number; lng: number; radius: number }
  makes?: string[]
  fuelTypes?: string[]
}

export interface UploadOptions {
  cacheControl?: string
  contentType?: string
  upsert?: boolean
}

export interface StorageResult {
  path: string
  publicUrl?: string
  error?: BackendError
}

export interface StorageObject {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

export interface RealtimePayload<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  timestamp: Date
}

export interface Subscription {
  id: string
  unsubscribe(): void
}

export interface Channel {
  on(event: string, callback: (payload: any) => void): Channel
  subscribe(): Subscription
}

export interface InvokeOptions {
  body?: any
  headers?: Record<string, string>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

export interface BackendError {
  message: string
  code?: string
  details?: any
}

// ====================================
// HELPER: CURRENT USER ID PROVIDER
// ====================================

export interface CurrentUserIdProvider {
  getUserId(): Promise<string | null>
}

export class SupabaseUserIdProvider implements CurrentUserIdProvider {
  constructor(private authClient: AuthClient) {}
  
  async getUserId(): Promise<string | null> {
    const session = await this.authClient.getSession()
    return session?.user.id || null
  }
}

export class NhostUserIdProvider implements CurrentUserIdProvider {
  constructor(private authClient: AuthClient) {}
  
  async getUserId(): Promise<string | null> {
    const session = await this.authClient.getSession()
    // Nhost uses Hasura claims
    return session?.user.id || null
  }
}

// ====================================
// FACTORY & PROVIDER SELECTION
// ====================================

export type BackendProvider = 'supabase' | 'nhost'

export async function createBackendClient(
  provider?: BackendProvider
): Promise<BackendClient> {
  const selectedProvider = provider || import.meta.env.VITE_BACKEND_PROVIDER || 'supabase'
  
  if (selectedProvider === 'nhost') {
    const { NhostBackendClient } = await import('./nhost-adapter')
    return new NhostBackendClient()
  } else {
    const { SupabaseBackendClient } = await import('./supabase-adapter')
    return new SupabaseBackendClient()
  }
}

// Global singleton (initialized lazily)
let backendClientInstance: BackendClient | null = null

export async function getBackendClient(): Promise<BackendClient> {
  if (!backendClientInstance) {
    backendClientInstance = await createBackendClient()
  }
  return backendClientInstance
}

// Reset for testing
export function resetBackendClient(): void {
  backendClientInstance = null
}

// ====================================
// ADAPTER BASE CLASS (OPTIONAL)
// ====================================

export abstract class BaseBackendAdapter implements BackendClient {
  abstract readonly name: 'supabase' | 'nhost'
  abstract readonly version: string
  
  abstract auth: AuthClient
  abstract db: DatabaseClient
  abstract storage: StorageClient
  abstract realtime: RealtimeClient
  abstract functions: FunctionsClient
  
  abstract getProviderClient(): unknown
  
  // Common helper methods
  protected handleError(error: any): BackendError {
    return {
      message: error.message || 'Unknown error',
      code: error.code,
      details: error
    }
  }
  
  protected async withErrorHandling<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

// ====================================
// TYPE GUARDS
// ====================================

export function isSupabaseClient(client: BackendClient): boolean {
  return client.name === 'supabase'
}

export function isNhostClient(client: BackendClient): boolean {
  return client.name === 'nhost'
}

// ====================================
// CONSTANTS
// ====================================

export const BACKEND_PROVIDERS = ['supabase', 'nhost'] as const

export const DEFAULT_PROVIDER: BackendProvider = 'supabase'

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  IMAGES: 'images',
  AVATARS: 'avatars',
  RECEIPTS: 'receipts'
} as const