// src/components/vehicle/VehicleRegistration.tsx
/**
 * CaiZen - Säker Fordonsregistrering
 * Privacy-first fordonsregistrering med automatisk datamaskering
 * Datum: 2025-09-28
 * Version: 2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Car, 
  Shield, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle,
  Upload,
  Loader
} from 'lucide-react';

import { 
  maskRegistrationNumber, 
  maskVIN, 
  isValidSwedishRegistration,
  isValidVIN,
  createAuditLog 
} from '@/lib/security/dataMasking';

import type { 
  Vehicle, 
  CreateType, 
  MaskedIdentifier,
  VerificationLevel 
} from '@/types';

interface VehicleRegistrationProps {
  onVehicleCreated: (vehicle: CreateType<Vehicle>) => void;
  onValidationError: (error: string) => void;
  className?: string;
}

interface FormData {
  registration: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  transmission: string;
}

interface ValidationState {
  registration: { valid: boolean; message: string };
  vin: { valid: boolean; message: string };
  general: { valid: boolean; message: string };
}

const MAKES = [
  'Volvo', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 
  'Toyota', 'Honda', 'Ford', 'Nissan', 'Hyundai', 'Kia',
  'Peugeot', 'Renault', 'Citroën', 'Škoda', 'SEAT', 'Mazda'
].sort();

const FUEL_TYPES = [
  { value: 'petrol', label: 'Bensin' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'El' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'plugin-hybrid', label: 'Laddhybrid' },
  { value: 'ethanol', label: 'Etanol (E85)' },
  { value: 'gas', label: 'Gas (CNG/LPG)' }
];

const VehicleRegistration: React.FC<VehicleRegistrationProps> = ({
  onVehicleCreated,
  onValidationError,
  className = ''
}) => {
  const [formData, setFormData] = useState<FormData>({
    registration: '',
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    fuelType: 'petrol',
    transmission: 'manual'
  });

  const [validation, setValidation] = useState<ValidationState>({
    registration: { valid: false, message: '' },
    vin: { valid: false, message: '' },
    general: { valid: false, message: '' }
  });

  const [showSensitiveData, setShowSensitiveData] = useState({
    registration: false,
    vin: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Validering av registreringsnummer
  const validateRegistration = useCallback((registration: string) => {
    if (!registration) {
      return { valid: false, message: 'Registreringsnummer krävs' };
    }

    const cleaned = registration.replace(/\s/g, '').toUpperCase();
    
    if (cleaned.length < 6) {
      return { valid: false, message: 'För kort registreringsnummer' };
    }

    if (!isValidSwedishRegistration(cleaned)) {
      return { valid: false, message: 'Ogiltigt svenskt registreringsnummer' };
    }

    return { valid: true, message: 'Giltigt registreringsnummer' };
  }, []);

  // Validering av VIN
  const validateVIN = useCallback((vin: string) => {
    if (!vin) {
      return { valid: false, message: 'VIN krävs för verifiering' };
    }

    const cleaned = vin.replace(/\s/g, '').toUpperCase();
    
    if (cleaned.length !== 17) {
      return { valid: false, message: 'VIN måste vara exakt 17 tecken' };
    }

    if (!isValidVIN(cleaned)) {
      return { valid: false, message: 'Ogiltigt VIN-format' };
    }

    return { valid: true, message: 'Giltigt VIN' };
  }, []);

  // Realtidsvalidering
  useEffect(() => {
    const newValidation = {
      registration: validateRegistration(formData.registration),
      vin: validateVIN(formData.vin),
      general: { valid: true, message: '' }
    };

    // Kontrollera att alla obligatoriska fält är ifyllda
    const requiredFields = ['make', 'model', 'color'];
    const missingFields = requiredFields.filter(field => 
      !formData[field as keyof FormData]
    );

    if (missingFields.length > 0) {
      newValidation.general = {
        valid: false,
        message: `Fyll i alla obligatoriska fält: ${missingFields.join(', ')}`
      };
    }

    setValidation(newValidation);
  }, [formData, validateRegistration, validateVIN]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createMaskedIdentifier = (value: string, type: 'registration' | 'vin'): MaskedIdentifier => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const masked = type === 'registration' 
      ? maskRegistrationNumber(cleaned)
      : maskVIN(cleaned);

    // I verklig implementation skulle hash skapas på backend
    const hash = btoa(cleaned).substring(0, 16);

    return {
      masked,
      hash,
      verified: false
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyAgreed) {
      onValidationError('Du måste acceptera behandling av fordonsdata');
      return;
    }

    const allValid = validation.registration.valid && 
                    validation.vin.valid && 
                    validation.general.valid;

    if (!allValid) {
      onValidationError('Korrigera valideringsfel innan du fortsätter');
      return;
    }

    setIsSubmitting(true);

    try {
      // Skapa audit log för datahantering
      const auditEntry = createAuditLog({
        action: 'vehicle_registration_started',
        dataType: 'registration',
        riskLevel: 'high',
        details: {
          make: formData.make,
          model: formData.model,
          year: formData.year
        }
      });

      console.log('Audit log:', auditEntry);

      // Skapa säkra identifierare
      const maskedRegistration = createMaskedIdentifier(formData.registration, 'registration');
      const maskedVIN = createMaskedIdentifier(formData.vin, 'vin');

      // Bestäm initial verifieringsnivå
      let verificationLevel: VerificationLevel = 'unverified';
      if (validation.vin.valid) verificationLevel = 'basic';

      const vehicleData: CreateType<Vehicle> = {
        userId: 'current-user-id', // Skulle komma från auth context
        registration: maskedRegistration,
        vin: maskedVIN,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        color: formData.color,
        fuelType: formData.fuelType as any,
        transmission: formData.transmission as any,
        verificationLevel,
        status: 'active',
        healthScore: 85, // Skulle beräknas baserat på data
        engineSize: undefined // Skulle kunna hämtas via VIN-dekodning
      };

      await onVehicleCreated(vehicleData);
      
      // Reset formulär
      setFormData({
        registration: '',
        vin: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        fuelType: 'petrol',
        transmission: 'manual'
      });
      
      setPrivacyAgreed(false);
      setShowSensitiveData({ registration: false, vin: false });

    } catch (error) {
      console.error('Fel vid fordonsregistrering:', error);
      onValidationError('Ett fel uppstod vid registreringen. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayValue = (value: string, field: 'registration' | 'vin') => {
    if (!value) return '';
    
    if (showSensitiveData[field]) {
      return value.toUpperCase();
    }
    
    return field === 'registration' 
      ? maskRegistrationNumber(value)
      : maskVIN(value);
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Header med säkerhetsindikator */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Car className="mr-2 text-blue-500" size={24} />
          Registrera fordon
        </h2>
        <div className="flex items-center text-sm text-gray-400">
          <Shield className="mr-1 text-green-500" size={16} />
          Säker datahantering
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Känsliga identifierare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Registreringsnummer */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Registreringsnummer *
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayValue(formData.registration, 'registration')}
                onChange={(e) => handleInputChange('registration', e.target.value)}
                placeholder="ABC123"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md pr-10 ${
                  validation.registration.valid 
                    ? 'border-green-500' 
                    : formData.registration 
                      ? 'border-red-500' 
                      : 'border-gray-600'
                }`}
                maxLength={7}
              />
              <button
                type="button"
                onClick={() => setShowSensitiveData(prev => ({
                  ...prev,
                  registration: !prev.registration
                }))}
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
              >
                {showSensitiveData.registration ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.registration && (
              <p className={`text-xs mt-1 ${
                validation.registration.valid ? 'text-green-400' : 'text-red-400'
              }`}>
                {validation.registration.message}
              </p>
            )}
          </div>

          {/* VIN */}
          <div>
            <label className="block text-sm font-medium mb-2">
              VIN-nummer *
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayValue(formData.vin, 'vin')}
                onChange={(e) => handleInputChange('vin', e.target.value)}
                placeholder="WBA3A5G59DNP26082"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md pr-10 ${
                  validation.vin.valid 
                    ? 'border-green-500' 
                    : formData.vin 
                      ? 'border-red-500' 
                      : 'border-gray-600'
                }`}
                maxLength={17}
              />
              <button
                type="button"
                onClick={() => setShowSensitiveData(prev => ({
                  ...prev,
                  vin: !prev.vin
                }))}
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
              >
                {showSensitiveData.vin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.vin && (
              <p className={`text-xs mt-1 ${
                validation.vin.valid ? 'text-green-400' : 'text-red-400'
              }`}>
                {validation.vin.message}
              </p>
            )}
          </div>
        </div>

        {/* Fordonsinformation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Märke */}
          <div>
            <label className="block text-sm font-medium mb-2">Märke *</label>
            <select
              value={formData.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            >
              <option value="">Välj märke</option>
              {MAKES.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Modell */}
          <div>
            <label className="block text-sm font-medium mb-2">Modell *</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="320d"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>

          {/* År */}
          <div>
            <label className="block text-sm font-medium mb-2">Årsmodell *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>

          {/* Färg */}
          <div>
            <label className="block text-sm font-medium mb-2">Färg *</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              placeholder="Svart metallic"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>

          {/* Bränsletyp */}
          <div>
            <label className="block text-sm font-medium mb-2">Bränsle</label>
            <select
              value={formData.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            >
              {FUEL_TYPES.map(fuel => (
                <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
              ))}
            </select>
          </div>

          {/* Växellåda */}
          <div>
            <label className="block text-sm font-medium mb-2">Växellåda</label>
            <select
              value={formData.transmission}
              onChange={(e) => handleInputChange('transmission', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            >
              <option value="manual">Manuell</option>
              <option value="automatic">Automat</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
        </div>

        {/* Privacy-information och samtycke */}
        <div className="bg-blue-900 bg-opacity-20 rounded-lg p-4 border border-blue-600">
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <Shield className="mr-2 text-blue-400" size={16} />
            Datasäkerhet och integritet
          </h3>
          <div className="text-xs text-gray-300 space-y-2">
            <p>
              ✅ <strong>Maskerade identifierare:</strong> Reg.nr och VIN visas som ABC*** / WBA***********1234
            </p>
            <p>
              ✅ <strong>Krypterad lagring:</strong> Känslig data krypteras med militärgrad säkerhet
            </p>
            <p>
              ✅ <strong>GDPR-kompatibel:</strong> Du kan exportera eller radera din data när som helst
            </p>
            <p>
              ✅ <strong>Audit logging:</strong> All åtkomst till fordonsdata loggas säkert
            </p>
          </div>

          <div className="mt-4 flex items-start">
            <input
              type="checkbox"
              id="privacy-consent"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              className="mt-1 mr-3"
            />
            <label htmlFor="privacy-consent" className="text-xs text-gray-300">
              Jag samtycker till att CaiZen behandlar min fordonsdata enligt{' '}
              <button 
                type="button"
                className="text-blue-400 underline hover:text-blue-300"
                onClick={() => window.open('/privacy-policy', '_blank')}
              >
                integritetspolicyn
              </button>
              . Känsliga identifierare (reg.nr/VIN) lagras krypterat och visas alltid maskerat.
            </label>
          </div>
        </div>

        {/* Valideringssammanfattning */}
        {!validation.general.valid && (
          <div className="bg-red-900 bg-opacity-20 rounded-lg p-4 border border-red-600">
            <div className="flex items-center mb-2">
              <AlertTriangle className="mr-2 text-red-400" size={16} />
              <span className="text-sm font-medium text-red-400">Åtgärda följande:</span>
            </div>
            <ul className="text-xs text-red-300 space-y-1">
              {!validation.registration.valid && formData.registration && (
                <li>• {validation.registration.message}</li>
              )}
              {!validation.vin.valid && formData.vin && (
                <li>• {validation.vin.message}</li>
              )}
              {!validation.general.valid && (
                <li>• {validation.general.message}</li>
              )}
              {!privacyAgreed && (
                <li>• Acceptera behandling av fordonsdata</li>
              )}
            </ul>
          </div>
        )}

        {/* Framgångsindikator */}
        {validation.registration.valid && validation.vin.valid && validation.general.valid && (
          <div className="bg-green-900 bg-opacity-20 rounded-lg p-4 border border-green-600">
            <div className="flex items-center">
              <CheckCircle className="mr-2 text-green-400" size={16} />
              <span className="text-sm font-medium text-green-400">
                Alla valideringar godkända - redo att registrera fordon
              </span>
            </div>
          </div>
        )}

        {/* Submit-knapp */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                registration: '',
                vin: '',
                make: '',
                model: '',
                year: new Date().getFullYear(),
                color: '',
                fuelType: 'petrol',
                transmission: 'manual'
              });
              setPrivacyAgreed(false);
              setShowSensitiveData({ registration: false, vin: false });
            }}
            className="px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Rensa
          </button>
          
          <button
            type="submit"
            disabled={
              !validation.registration.valid || 
              !validation.vin.valid || 
              !validation.general.valid || 
              !privacyAgreed || 
              isSubmitting
            }
            className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 animate-spin" size={16} />
                Registrerar...
              </>
            ) : (
              <>
                <Car className="mr-2" size={16} />
                Registrera fordon
              </>
            )}
          </button>
        </div>
      </form>

      {/* Hjälptext */}
      <div className="mt-6 text-xs text-gray-400 space-y-1">
        <p><strong>Tips:</strong> VIN-numret hittar du vanligtvis på instrumentbrädan nära vindrutan eller i dörrkarmen.</p>
        <p><strong>Säkerhet:</strong> All fordonsdata krypteras och dina identifierare maskeras automatiskt.</p>
        <p><strong>Verifiering:</strong> Vi använder VIN för att automatiskt hämta korrekt fordonsinformation.</p>
      </div>
    </div>
  );
};

export default VehicleRegistration;