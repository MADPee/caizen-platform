// src/lib/security/dataMasking.ts
/**
 * CaiZen Security Utils - Data Masking & Privacy Protection
 * Datum: 2025-09-28
 * Version: 2.0
 */

export interface MaskingOptions {
  visibleStart?: number;
  visibleEnd?: number;
  maskChar?: string;
  preserveFormat?: boolean;
}

export interface SensitiveDataPattern {
  name: string;
  pattern: RegExp;
  maskingFunction: (value: string) => string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Maskerar svenskt registreringsnummer
 * Exempel: "ABC123" -> "ABC***"
 */
export const maskRegistrationNumber = (
  registration: string,
  options: MaskingOptions = {}
): string => {
  if (!registration || registration.length <= 3) return registration;
  
  const { visibleStart = 3, maskChar = '*' } = options;
  const masked = registration.substring(0, visibleStart) + 
                maskChar.repeat(registration.length - visibleStart);
  
  return masked;
};

/**
 * Maskerar VIN-nummer
 * Exempel: "WBA3A5G59DNP26082" -> "WBA***********6082"
 */
export const maskVIN = (
  vin: string,
  options: MaskingOptions = {}
): string => {
  if (!vin || vin.length <= 8) return vin;
  
  const { visibleStart = 3, visibleEnd = 4, maskChar = '*' } = options;
  const maskLength = vin.length - visibleStart - visibleEnd;
  
  if (maskLength <= 0) return vin;
  
  return vin.substring(0, visibleStart) + 
         maskChar.repeat(maskLength) + 
         vin.substring(vin.length - visibleEnd);
};

/**
 * Maskerar personnummer
 * Exempel: "19901201-1234" -> "199012**-****"
 */
export const maskPersonalNumber = (
  personalNumber: string,
  options: MaskingOptions = {}
): string => {
  if (!personalNumber) return personalNumber;
  
  const { maskChar = '*' } = options;
  
  // Format: YYYYMMDD-XXXX eller YYMMDD-XXXX
  if (personalNumber.includes('-')) {
    const [datePart, lastPart] = personalNumber.split('-');
    if (datePart.length >= 6) {
      const visibleDate = datePart.substring(0, 6);
      const maskedDate = visibleDate + maskChar.repeat(datePart.length - 6);
      const maskedLast = maskChar.repeat(lastPart.length);
      return `${maskedDate}-${maskedLast}`;
    }
  }
  
  return maskChar.repeat(personalNumber.length);
};

/**
 * Maskerar telefonnummer
 * Exempel: "070-123 45 67" -> "070-*** ** **"
 */
export const maskPhoneNumber = (
  phone: string,
  options: MaskingOptions = {}
): string => {
  if (!phone) return phone;
  
  const { preserveFormat = true, maskChar = '*' } = options;
  
  if (preserveFormat) {
    // Bevara format men maskera siffror efter prefix
    return phone.replace(/\d(?=.*\d{2})/g, maskChar);
  }
  
  return phone.substring(0, 4) + maskChar.repeat(Math.max(0, phone.length - 4));
};

/**
 * Automatisk känslighetsdetektor för user-generated content
 */
export const sensitiveDataPatterns: SensitiveDataPattern[] = [
  {
    name: 'Swedish Registration Number',
    pattern: /\b[A-Z]{3}\s*\d{2}[A-Z0-9]\b/g,
    maskingFunction: maskRegistrationNumber,
    riskLevel: 'critical'
  },
  {
    name: 'VIN Number',
    pattern: /\b[A-HJ-NPR-Z0-9]{17}\b/g,
    maskingFunction: maskVIN,
    riskLevel: 'critical'
  },
  {
    name: 'Swedish Personal Number',
    pattern: /\b(?:19|20)?\d{6}[-\s]?\d{4}\b/g,
    maskingFunction: maskPersonalNumber,
    riskLevel: 'critical'
  },
  {
    name: 'Phone Number',
    pattern: /\b0\d{1,3}[-\s]?\d{3}\s?\d{2}\s?\d{2}\b/g,
    maskingFunction: maskPhoneNumber,
    riskLevel: 'medium'
  },
  {
    name: 'Email Address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    maskingFunction: (email) => {
      const [local, domain] = email.split('@');
      return local.substring(0, 2) + '***@' + domain;
    },
    riskLevel: 'medium'
  }
];

/**
 * Automatisk censurering av känslig data i text
 */
export const autoMaskSensitiveData = (
  content: string,
  options: { warnOnly?: boolean } = {}
): { 
  maskedContent: string; 
  detectedPatterns: Array<{ type: string; riskLevel: string; count: number }>;
  originalLength: number;
} => {
  let maskedContent = content;
  const detectedPatterns: Array<{ type: string; riskLevel: string; count: number }> = [];
  
  sensitiveDataPatterns.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches && matches.length > 0) {
      detectedPatterns.push({
        type: pattern.name,
        riskLevel: pattern.riskLevel,
        count: matches.length
      });
      
      if (!options.warnOnly) {
        maskedContent = maskedContent.replace(pattern.pattern, (match) => 
          pattern.maskingFunction(match)
        );
      }
    }
  });
  
  return {
    maskedContent,
    detectedPatterns,
    originalLength: content.length
  };
};

/**
 * GDPR-kompatibel data export formatter
 */
export const formatForDataExport = (data: any, includePersonalData: boolean = false): any => {
  if (!includePersonalData) {
    // Ta bort eller maskera all personlig data
    const sanitized = JSON.parse(JSON.stringify(data));
    
    const recursiveMask = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          // Kontrollera om fältet innehåller känslig data
          const result = autoMaskSensitiveData(obj[key], { warnOnly: false });
          if (result.detectedPatterns.length > 0) {
            obj[key] = result.maskedContent;
          }
        } else if (typeof obj[key] === 'object') {
          obj[key] = recursiveMask(obj[key]);
        }
      });
      
      return obj;
    };
    
    return recursiveMask(sanitized);
  }
  
  return data;
};

/**
 * Validation helpers för säker data-input
 */
export const isValidSwedishRegistration = (registration: string): boolean => {
  // Svenska registreringsnummer: 3 bokstäver + 3 tecken (siffror eller bokstäver)
  const pattern = /^[A-Z]{3}[0-9A-Z]{3}$/;
  return pattern.test(registration.replace(/\s/g, '').toUpperCase());
};

export const isValidVIN = (vin: string): boolean => {
  // VIN: 17 tecken, inga I, O eller Q
  const pattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  return pattern.test(vin.toUpperCase());
};

/**
 * Security audit logger
 */
export interface AuditLogEntry {
  timestamp: Date;
  action: string;
  dataType: 'registration' | 'vin' | 'personal' | 'document';
  userId?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export const createAuditLog = (entry: Omit<AuditLogEntry, 'timestamp'>): AuditLogEntry => {
  return {
    ...entry,
    timestamp: new Date()
  };
};

// Development helpers (endast för utveckling)
export const DEV_HELPERS = {
  generateTestRegistration: () => `TEST${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
  generateTestVIN: () => 'WBA' + Math.random().toString(36).substr(2, 14).toUpperCase(),
  validateMasking: (original: string, masked: string) => {
    const originalChars = original.replace(/[^A-Z0-9]/g, '');
    const maskedChars = masked.replace(/[^A-Z0-9*]/g, '');
    return maskedChars.includes('*') && originalChars.length === maskedChars.length;
  }
};

// Export all security constants
export const SECURITY_CONSTANTS = {
  MAX_REGISTRATION_LENGTH: 7,
  VIN_LENGTH: 17,
  MASK_CHARACTER: '*',
  AUDIT_LOG_RETENTION_DAYS: 2555, // 7 år enligt bokföringslagen
  GDPR_DATA_RETENTION_DAYS: 2555,
  HIGH_RISK_PATTERNS: ['VIN', 'Registration', 'Personal Number']
} as const;