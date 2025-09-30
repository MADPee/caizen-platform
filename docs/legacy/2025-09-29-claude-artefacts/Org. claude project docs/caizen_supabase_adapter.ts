// src/lib/backend/supabase-adapter.ts
/**
 * CaiZen Supabase Backend Adapter
 * Implementation of BackendClient interface for Supabase
 * Version: 2.0
 */

import { createClient, SupabaseClient, Session as SupabaseSession } from '@supabase/supabase-js'
import type {
  BackendClient,
  AuthClient,
  DatabaseClient,
  StorageClient,
  RealtimeClient,
  FunctionsClient,
  SignUpCredentials,
  SignInCredentials,
  AuthResult,
  Session,
  QueryOptions,
  MarketplaceFilters,
  UploadOptions,
  StorageResult,
  StorageObject,
  RealtimePayload,
  Subscription,
  Channel,
  InvokeOptions,
  BackendError
} from './interface'

import type { Vehicle, FuelEntry, MarketplaceListing, User, CreateType, UpdateType } from '@/types'
import { maskRegistrationNumber, maskVIN } from '../security/dataMasking'

// ====================================
// SUPABASE CLIENT SETUP
// ====================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Check your .env file.')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ====================================
// AUTH CLIENT IMPLEMENTATION
// ====================================

class SupabaseAuthClient implements AuthClient {
  constructor(private client: SupabaseClient) {}
  
  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    const { data, error } = await this.client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: credentials.metadata
      }
    })
    
    if (error) {
      return { user: null, session: null, error: this.mapError(error) }
    }
    
    return {
      user: data.user ? this.mapUser(data.user) : null,
      session: data.session ? this.mapSession(data.session) : null
    }
  }
  
  async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })
    
    if (error) {
      return { user: null, session: null, error: this.mapError(error) }
    }
    
    return {
      user: data.user ? this.mapUser(data.user) : null,
      session: data.session ? this.mapSession(data.session) : null
    }
  }
  
  async signOut(): Promise<void> {
    await this.client.auth.signOut()
  }
  
  async getSession(): Promise<Session | null> {
    const { data } = await this.client.auth.getSession()
    return data.session ? this.mapSession(data.session) : null
  }
  
  async refreshSession(): Promise<Session | null> {
    const { data } = await this.client.auth.refreshSession()
    return data.session ? this.mapSession(data.session) : null
  }
  
  async resetPassword(email: string): Promise<void> {
    await this.client.auth.resetPasswordForEmail(email)
  }
  
  async updatePassword(newPassword: string): Promise<void> {
    await this.client.auth.updateUser({ password: newPassword })
  }
  
  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data: { subscription } } = this.client.auth.onAuthStateChange((_event, session) => {
      callback(session ? this.mapSession(session) : null)
    })
    
    return () => subscription.unsubscribe()
  }
  
  private mapUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at),
      lastLoginAt: new Date(),
      isActive: true,
      privacySettings: {
        allowMarketplaceSharing: false,
        allowCommunityParticipation: false,
        allowAnonymizedAnalytics: false,
        dataRetentionConsent: true,
        lastUpdated: new Date()
      },
      preferences: {
        language: 'sv',
        currency: 'SEK',
        units: 'metric',
        theme: 'dark',
        notifications: {
          email: true,
          push: false,
          sms: false,
          marketplace: true,
          community: true,
          maintenance: true,
          security: true
        }
      },
      verificationLevel: 'email_verified'
    }
  }
  
  private mapSession(supabaseSession: SupabaseSession): Session {
    return {
      accessToken: supabaseSession.access_token,
      refreshToken: supabaseSession.refresh_token || '',
      expiresAt: supabaseSession.expires_at || 0,
      user: this.mapUser(supabaseSession.user)
    }
  }
  
  private mapError(error: any): BackendError {
    return {
      message: error.message,
      code: error.code,
      details: error
    }
  }
}

// ====================================
// DATABASE CLIENT IMPLEMENTATION
// ====================================

class SupabaseDatabaseClient implements DatabaseClient {
  constructor(private client: SupabaseClient) {}
  
  // Generic CRUD
  async query<T>(table: string, options?: QueryOptions): Promise<T[]> {
    let query = this.client.from(table).select('*')
    
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending 
      })
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as T[]
  }
  
  async get<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data as T
  }
  
  async insert<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result as T
  }
  
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result as T
  }
  
  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.client
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
  
  // Typed operations
  vehicles = {
    list: async (): Promise<Vehicle[]> => {
      const { data, error } = await this.client
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data.map(this.mapVehicle)
    },
    
    get: async (id: string): Promise<Vehicle | null> => {
      const { data, error } = await this.client
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) return null
      return this.mapVehicle(data)
    },
    
    create: async (vehicleData: CreateType<Vehicle>): Promise<Vehicle> => {
      // Hash for storage (backend should do this, but for demo)
      const registrationHash = btoa(vehicleData.registration.masked)
      const vinHash = btoa(vehicleData.vin.masked)
      
      const { data, error } = await this.client
        .from('vehicles')
        .insert({
          user_id: vehicleData.userId,
          registration_encrypted: vehicleData.registration.masked,
          vin_encrypted: vehicleData.vin.masked,
          registration_hash: registrationHash,
          vin_hash: vinHash,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          fuel_type: vehicleData.fuelType,
          engine_size: vehicleData.engineSize,
          transmission: vehicleData.transmission,
          verification_level: vehicleData.verificationLevel,
          status: vehicleData.status,
          health_score: vehicleData.healthScore
        })
        .select()
        .single()
      
      if (error) throw error
      return this.mapVehicle(data)
    },
    
    update: async (id: string, vehicleData: UpdateType<Vehicle>): Promise<Vehicle> => {
      const { data, error } = await this.client
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return this.mapVehicle(data)
    },
    
    delete: async (id: string): Promise<void> => {
      const { error } = await this.client
        .from('vehicles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  }
  
  fuelEntries = {
    list: async (vehicleId: string): Promise<FuelEntry[]> => {
      const { data, error } = await this.client
        .from('fuel_entries')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false })
      
      if (error) throw error
      return data.map(this.mapFuelEntry)
    },
    
    create: async (entryData: CreateType<FuelEntry>): Promise<FuelEntry> => {
      const { data, error } = await this.client
        .from('fuel_entries')
        .insert({
          vehicle_id: entryData.vehicleId,
          date: entryData.date,
          time: entryData.time,
          station: entryData.station,
          fuel_type: entryData.fuelType,
          amount: entryData.amount,
          price_per_unit: entryData.pricePerUnit,
          total_cost: entryData.totalCost,
          odometer_reading: entryData.odometerReading,
          location_lat: entryData.location?.latitude,
          location_lng: entryData.location?.longitude
        })
        .select()
        .single()
      
      if (error) throw error
      return this.mapFuelEntry(data)
    },
    
    delete: async (id: string): Promise<void> => {
      const { error } = await this.client
        .from('fuel_entries')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  }
  
  marketplace = {
    list: async (filters?: MarketplaceFilters): Promise<MarketplaceListing[]> => {
      let query = this.client
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active')
      
      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange.min)
          .lte('price', filters.priceRange.max)
      }
      
      if (filters?.makes && filters.makes.length > 0) {
        // Would need to join with vehicles table
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as MarketplaceListing[]
    },
    
    get: async (id: string): Promise<MarketplaceListing | null> => {
      const { data, error } = await this.client
        .from('marketplace_listings')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) return null
      return data as MarketplaceListing
    },
    
    create: async (listingData: CreateType<MarketplaceListing>): Promise<MarketplaceListing> => {
      const { data, error } = await this.client
        .from('marketplace_listings')
        .insert(listingData)
        .select()
        .single()
      
      if (error) throw error
      return data as MarketplaceListing
    },
    
    update: async (id: string, listingData: UpdateType<MarketplaceListing>): Promise<MarketplaceListing> => {
      const { data, error } = await this.client
        .from('marketplace_listings')
        .update(listingData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as MarketplaceListing
    },
    
    delete: async (id: string): Promise<void> => {
      const { error } = await this.client
        .from('marketplace_listings')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  }
  
  private mapVehicle(data: any): Vehicle {
    return {
      id: data.id,
      userId: data.user_id,
      registration: {
        masked: maskRegistrationNumber(data.registration_encrypted),
        hash: data.registration_hash,
        verified: data.verification_level !== 'unverified'
      },
      vin: {
        masked: maskVIN(data.vin_encrypted),
        hash: data.vin_hash,
        verified: data.verification_level !== 'unverified'
      },
      make: data.make,
      model: data.model,
      year: data.year,
      color: data.color,
      fuelType: data.fuel_type,
      engineSize: data.engine_size,
      transmission: data.transmission,
      verificationLevel: data.verification_level,
      status: data.status,
      healthScore: data.health_score,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastInspection: data.last_inspection ? new Date(data.last_inspection) : undefined,
      nextInspection: data.next_inspection ? new Date(data.next_inspection) : undefined
    }
  }
  
  private mapFuelEntry(data: any): FuelEntry {
    return {
      id: data.id,
      vehicleId: data.vehicle_id,
      date: new Date(data.date),
      time: data.time,
      station: data.station,
      fuelType: data.fuel_type,
      amount: data.amount,
      pricePerUnit: data.price_per_unit,
      totalCost: data.total_cost,
      odometerReading: data.odometer_reading,
      location: data.location_lat && data.location_lng ? {
        latitude: data.location_lat,
        longitude: data.location_lng
      } : undefined,
      createdAt: new Date(data.created_at)
    }
  }
}

// ====================================
// STORAGE CLIENT IMPLEMENTATION
// ====================================

class SupabaseStorageClient implements StorageClient {
  constructor(private client: SupabaseClient) {}
  
  async upload(bucket: string, path: string, file: File, options?: UploadOptions): Promise<StorageResult> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl,
        contentType: options?.contentType,
        upsert: options?.upsert
      })
    
    if (error) {
      return {
        path: '',
        error: { message: error.message, code: error.name }
      }
    }
    
    const publicUrl = this.getPublicUrl(bucket, data.path)
    
    return {
      path: data.path,
      publicUrl
    }
  }
  
  async download(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(path)
    
    if (error) throw error
    return data
  }
  
  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  }
  
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
  
  async createSignedUrl(bucket: string, path: string, expiresIn: number): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) throw error
    return data.signedUrl
  }
  
  async list(bucket: string, path?: string): Promise<StorageObject[]> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .list(path)
    
    if (error) throw error
    return data as StorageObject[]
  }
}

// ====================================
// REALTIME CLIENT IMPLEMENTATION
// ====================================

class SupabaseRealtimeClient implements RealtimeClient {
  constructor(private client: SupabaseClient) {}
  
  subscribe<T>(channelName: string, callback: (payload: RealtimePayload<T>) => void): Subscription {
    const channel = this.client
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        callback({
          eventType: payload.eventType as any,
          new: payload.new as T,
          old: payload.old as T,
          timestamp: new Date()
        })
      })
      .subscribe()
    
    return {
      id: channelName,
      unsubscribe: () => this.client.removeChannel(channel)
    }
  }
  
  unsubscribe(subscription: Subscription): void {
    subscription.unsubscribe()
  }
  
  channel(name: string): Channel {
    const supabaseChannel = this.client.channel(name)
    
    return {
      on: (event: string, callback: (payload: any) => void) => {
        supabaseChannel.on(event as any, callback)
        return this as any
      },
      subscribe: () => {
        supabaseChannel.subscribe()
        return {
          id: name,
          unsubscribe: () => this.client.removeChannel(supabaseChannel)
        }
      }
    }
  }
}

// ====================================
// FUNCTIONS CLIENT IMPLEMENTATION
// ====================================

class SupabaseFunctionsClient implements FunctionsClient {
  constructor(private client: SupabaseClient) {}
  
  async invoke<T = any>(functionName: string, options?: InvokeOptions): Promise<T> {
    const { data, error } = await this.client.functions.invoke(functionName, {
      body: options?.body,
      headers: options?.headers,
      method: options?.method
    })
    
    if (error) throw error
    return data as T
  }
}

// ====================================
// MAIN BACKEND CLIENT
// ====================================

export class SupabaseBackendClient implements BackendClient {
  readonly name = 'supabase' as const
  readonly version = '2.0.0'
  
  readonly auth: AuthClient
  readonly db: DatabaseClient
  readonly storage: StorageClient
  readonly realtime: RealtimeClient
  readonly functions: FunctionsClient
  
  constructor() {
    this.auth = new SupabaseAuthClient(supabase)
    this.db = new SupabaseDatabaseClient(supabase)
    this.storage = new SupabaseStorageClient(supabase)
    this.realtime = new SupabaseRealtimeClient(supabase)
    this.functions = new SupabaseFunctionsClient(supabase)
  }
  
  getProviderClient(): SupabaseClient {
    return supabase
  }
}