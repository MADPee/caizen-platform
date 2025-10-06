
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Clock, Navigation, BarChart2, Droplet, AlertTriangle, Check, Settings, FilePlus, ShieldAlert, Download, FileText, Share2, Map, Lock, Database, Eye, EyeOff, Star, Crown, Infinity, Shield } from 'lucide-react';

const FuelManagementDashboardV2 = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [privacyMode, setPrivacyMode] = useState('masked');
  
  // Mock data med privacy-first separation
  const vehicleData = {
    // PERMANENT FORDONSDATA (anonymiserad)
    permanent: {
      vin_masked: "WBA***********424",
      registration_masked: "MKN***", 
      make: "BMW",
      model: "218i GRAN TOURER",
      year: 2016,
      nationality_code: "S",
      verification_level: 5,
      custody_established: "2018-11-02",
      document_count: 89,
      last_inspection: "2025-04-17",
      next_inspection: "2026-06-30",
      odometer: {
        current: 166216,
        inspection_reading: 165618,
        history: [
          { date: "2024-01-29", value: 148129, verified: true },
          { date: "2022-10-05", value: 121041, verified: true },
          { date: "2021-08-10", value: 100334, verified: true }
        ]
      },
      environmental_values: {
        co2: "0.0 % (0.3 %)",
        hc: "0 ppm (200 ppm)", 
        lambda: "1.01 (0.97 - 1.03)",
        status: "GODKÄND"
      }
    }
  };
  
  const personalData = {
    // KRYPTERAD PERSONDATA (7 års retention)
    encrypted: {
      owner_name_masked: "Mikael G*****",
      contact_masked: "***-***-**23",
      payment_method_masked: "**** **** **** 4532",
      insurance_masked: "Folksam ****567",
      privacy_level: "strict",
      gdpr_consent: true,
      last_access: "2025-05-30 14:23"
    }
  };
  
  const fuelData = {
    // FORDONSDATA - Anonymiserad bränslehistorik
    vehicle_fuel_history: {
      latest_refueling: {
        date: "2025-04-18",
        time: "13:17:51", 
        station_chain: "Preem", // Kedja, ej exakt adress
        station_region: "Haninge", // Endast region för privacy
        fuel_type: "Blyfri 95",
        amount: 35.44,
        price_per_liter: 15.49,
        total_cost: 548.97,
        odometer_reading: 166216,
        distance_since_last: 579,
        verification_level: 4 // OCR-verifierat
      },
      statistics: {
        average_consumption: 7.6,
        previous_month_average: 7.8,
        consumption_change: -2.6,
        computer_estimated: 5.9,
        actual_measured: 6.12,
        city_driving: 7.3,
        highway_driving: 5.9,
        co2_emissions: 141.4,
        yearly_distance: 17500,
        cost_per_km: 0.95
      },
      predictions: {
        next_refueling_date: "2025-06-08",
        estimated_cost: 680,
        estimated_range: 640
      }
    },
    
    // PERSONDATA - Betalningar (krypterad)
    personal_payment_history: {
      encrypted: true,
      accessible_with_consent: showPersonalData,
      total_spent_year: showPersonalData ? 14250 : "****",
      payment_methods_used: showPersonalData ? ["Kort", "Swish"] : ["****"],
      privacy_note: "Betalningsdata krypterad enligt GDPR"
    }
  };

  // Maskera känsliga identifierare
  const maskVIN = (vin: string) => {
    if (vin.length !== 17) return vin;
    return vin.substring(0, 3) + '*'.repeat(11) + vin.substring(14);
  };
  
  const maskRegistration = (reg: string) => {
    if (reg.length <= 3) return reg;
    return reg.substring(0, 3) + '*'.repeat(reg.length - 3);
  };

  // Privacy indicators komponent
  const PrivacyIndicator = ({ type, retention, gdprStatus }: { type: string; retention?: string; gdprStatus?: boolean }) => {
    const colors = {
      personal: 'bg-red-900 bg-opacity-20 text-red-400 border-red-400',
      vehicle: 'bg-green-900 bg-opacity-20 text-green-400 border-green-400',
      mixed: 'bg-yellow-900 bg-opacity-20 text-yellow-400 border-yellow-400'
    };
    
    const icons = {
      personal: <Lock size={12} />,
      vehicle: <Database size={12} />,
      mixed: <AlertTriangle size={12} />
    };
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${colors[type as keyof typeof colors]}`}>
        {icons[type as keyof typeof icons]}
        <span>{type === 'personal' ? 'Persondata' : type === 'vehicle' ? 'Fordonsdata' : 'Blandat'}</span>
        {retention && (
          <>
            <span>•</span>
            <span>{retention}</span>
          </>
        )}
        {gdprStatus && (
          <>
            <span>•</span>
            <Check size={10} />
          </>
        )}
      </div>
    );
  };

  // Privacy header komponent
  const PrivacyHeader = ({ type, title, children }: { type: string; title: string; children?: React.ReactNode }) => {
    const headerStyles = {
      personal: 'bg-red-900 bg-opacity-10 border-b-2 border-red-400 text-red-400',
      vehicle: 'bg-green-900 bg-opacity-10 border-b-2 border-green-400 text-green-400'
    };
    
    return (
      <div className={`px-4 py-3 font-semibold text-sm flex items-center justify-between ${headerStyles[type as keyof typeof headerStyles]}`}>
        <div className="flex items-center gap-2">
          {type === 'personal' ? <Lock size={16} /> : <Database size={16} />}
          {title}
        </div>
        <div className="flex items-center gap-2">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Privacy Info Modal */}
      {showPrivacyInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ShieldAlert className="text-blue-400 mr-2" size={20} />
                Privacy by Design
              </h3>
              <button 
                onClick={() => setShowPrivacyInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-green-900 bg-opacity-20 p-3 rounded">
                <h4 className="text-green-400 font-medium mb-2">Fordonsdata (Permanent)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Bränsleförbrukning och tekniska mätningar</li>
                  <li>• Anonymiserad - ingen personkoppling</li>
                  <li>• Följer bilen för alltid</li>
                  <li>• Kan aldrig raderas</li>
                </ul>
              </div>
              <div className="bg-red-900 bg-opacity-20 p-3 rounded">
                <h4 className="text-red-400 font-medium mb-2">Persondata (Krypterad)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Betalningsinformation och kontaktuppgifter</li>
                  <li>• AES-256 kryptering</li>
                  <li>• 7 års retention</li>
                  <li>• GDPR-raderbar när som helst</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowPrivacyInfo(false)}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Förstådd
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10 shadow-md">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Droplet size={18} />
            </div>
            <h1 className="text-xl font-semibold">
              <span className="text-blue-500">Bränsle</span>
              <span className="text-orange-500">hantering</span>
              <span className="text-xs ml-2 text-gray-400">v2.0</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <PrivacyIndicator type="vehicle" retention="Permanent" gdprStatus={true} />
            <button 
              onClick={() => setShowPrivacyInfo(true)}
              className="text-gray-400 hover:text-white"
              title="Privacy Information"
            >
              <ShieldAlert size={20} />
            </button>
            <button className="text-gray-400 hover:text-white" title="Exportera rapport">
              <Download size={20} />
            </button>
            <button className="text-gray-400 hover:text-white" title="Inställningar">
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 py-1">
          <div className="container mx-auto px-4 flex overflow-x-auto">
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('overview')}
            >
              Översikt
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'privacy' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Controls
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'analysis' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('analysis')}
            >
              Analys
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Vehicle custody summary */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-green-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold">{vehicleData.permanent.make} {vehicleData.permanent.model}</h2>
                <PrivacyIndicator type="vehicle" retention="Permanent" gdprStatus={true} />
              </div>
              <p className="text-gray-400 font-mono">
                {vehicleData.permanent.registration_masked} • VIN: {vehicleData.permanent.vin_masked} • {vehicleData.permanent.odometer.current} km
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Crown size={14} className="text-orange-500" />
                <span className="text-sm text-gray-400">Under din custody sedan {vehicleData.permanent.custody_established}</span>
                <div className="flex items-center gap-1 ml-2">
                  <Star size={14} className="text-orange-500" fill="currentColor" />
                  <span className="text-sm">{vehicleData.permanent.verification_level}/5</span>
                </div>
              </div>
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Dokument</p>
                <p className="text-sm font-mono text-green-500">{vehicleData.permanent.document_count}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Förbrukning</p>
                <p className="text-sm font-mono text-orange-500">{fuelData.vehicle_fuel_history.statistics.average_consumption} l/100km</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Besiktning</p>
                <p className="text-sm font-mono text-green-500">{vehicleData.permanent.environmental_values.status}</p>
              </div>
            </div>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <>
            {/* Dual View - Latest refueling */}
            <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vehicle Data Section */}
              <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-md border-l-4 border-green-500">
                <PrivacyHeader type="vehicle" title="Senaste Tankning (Fordonsdata)">
                  <PrivacyIndicator type="vehicle" retention="Permanent" />
                </PrivacyHeader>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-green-400">Anonymiserad Tankningsdata</h3>
                      <p className="text-sm text-gray-400">{fuelData.vehicle_fuel_history.latest_refueling.date}, {fuelData.vehicle_fuel_history.latest_refueling.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-green-500" />
                      <span className="text-xs text-green-400">Evighetsförvar</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Mängd</p>
                      <p className="text-xl font-mono text-orange-500">{fuelData.vehicle_fuel_history.latest_refueling.amount} L</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Bränsletyp</p>
                      <p className="text-xl font-mono">{fuelData.vehicle_fuel_history.latest_refueling.fuel_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Mätarställning</p>
                      <p className="text-xl font-mono">{fuelData.vehicle_fuel_history.latest_refueling.odometer_reading} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Körsträcka</p>
                      <p className="text-xl font-mono text-blue-400">{fuelData.vehicle_fuel_history.latest_refueling.distance_since_last} km</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Station (Region)</p>
                          <p className="text-sm">{fuelData.vehicle_fuel_history.latest_refueling.station_chain} {fuelData.vehicle_fuel_history.latest_refueling.station_region}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Verifierad</p>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-orange-500" fill="currentColor" />
                            <span className="text-sm">{fuelData.vehicle_fuel_history.latest_refueling.verification_level}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-900 bg-opacity-20 p-3 rounded">
                      <p className="text-xs text-gray-400 mb-1">Förbrukning (Uppmätt)</p>
                      <p className="text-lg font-mono text-green-400">
                        {fuelData.vehicle_fuel_history.statistics.actual_measured} l/100km
                      </p>
                      <p className="text-xs text-gray-400">vs Färddator: {fuelData.vehicle_fuel_history.statistics.computer_estimated} l/100km</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Personal Data Section */}
              <div className="bg-gray-800 rounded-lg shadow-md border-l-4 border-red-500">
                <PrivacyHeader type="personal" title="Betalningsdata (Krypterad)">
                  <PrivacyIndicator type="personal" retention="7 år" gdprStatus={true} />
                  <button
                    onClick={() => setShowPersonalData(!showPersonalData)}
                    className={`text-xs px-2 py-1 rounded border ${showPersonalData ? 'bg-red-600 border-red-600 text-white' : 'border-gray-500 text-gray-400 hover:text-white'}`}
                  >
                    {showPersonalData ? <><EyeOff size={12} /> Dölj</> : <><Eye size={12} /> Visa</>}
                  </button>
                </PrivacyHeader>
                
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="bg-red-900 bg-opacity-20 p-3 rounded border border-red-400">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={16} className="text-red-400" />
                        <span className="text-red-400 font-medium">Krypterad Data</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Betalningsmetod</p>
                          <p className="text-sm font-mono">
                            {showPersonalData ? "Kort ****4532" : personalData.encrypted.payment_method_masked}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total kostnad</p>
                          <p className="text-sm font-mono text-red-400">
                            {showPersonalData ? `${fuelData.vehicle_fuel_history.latest_refueling.total_cost} kr` : "***,** kr"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Prispunkt</p>
                          <p className="text-sm font-mono">
                            {showPersonalData ? `${fuelData.vehicle_fuel_history.latest_refueling.price_per_liter} kr/L` : "**,** kr/L"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-3 rounded">
                      <h4 className="text-red-400 text-sm font-medium mb-2">GDPR Kontroller</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm">
                          <Download size={12} className="inline mr-1" /> Exportera Data
                        </button>
                        <button className="w-full bg-red-800 hover:bg-red-900 text-white py-1 px-3 rounded text-sm">
                          <AlertTriangle size={12} className="inline mr-1" /> Radera Persondata
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        ℹ️ Radering påverkar INTE fordonshistoriken
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Analytics - Anonymized Vehicle Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-green-500">
                <PrivacyHeader type="vehicle" title="Förbrukningsanalys (Anonymiserad)">
                  <PrivacyIndicator type="vehicle" retention="Permanent" />
                </PrivacyHeader>
                
                <div className="p-4">
                  <div className="h-48 relative bg-gray-900 bg-opacity-50 rounded p-4 mb-4">
                    <div className="absolute top-4 left-4">
                      <span className="text-sm font-mono text-orange-500">{fuelData.vehicle_fuel_history.statistics.average_consumption} l/100km</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-gray-400">Genomsnitt</span>
                    </div>
                    
                    {/* Simple trend visualization */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between h-24">
                      {[85, 92, 78, 71, 68].map((height, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-green-500 bg-opacity-60 rounded-t"
                            style={{ height: `${height}px` }}
                          ></div>
                          <span className="text-xs mt-1">Q{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Stad vs Motorväg</p>
                      <p className="font-mono text-lg">{fuelData.vehicle_fuel_history.statistics.city_driving} vs {fuelData.vehicle_fuel_history.statistics.highway_driving}</p>
                      <span className="text-xs text-gray-400">l/100km</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">CO₂-utsläpp</p>
                      <p className="font-mono text-lg text-orange-500">{fuelData.vehicle_fuel_history.statistics.co2_emissions} g/km</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-green-500">
                <PrivacyHeader type="vehicle" title="Prediktioner (AI-Baserade)">
                  <PrivacyIndicator type="vehicle" retention="Permanent" />
                </PrivacyHeader>
                
                <div className="p-4 space-y-4">
                  <div className="bg-blue-900 bg-opacity-20 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-400">Nästa tankning</span>
                      <Calendar size={16} className="text-blue-400" />
                    </div>
                    <p className="font-mono text-lg">{fuelData.vehicle_fuel_history.predictions.next_refueling_date}</p>
                    <p className="text-xs text-gray-400">Estimerad kostnad: ~{fuelData.vehicle_fuel_history.predictions.estimated_cost} kr</p>
                  </div>
                  
                  <div className="bg-green-900 bg-opacity-20 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-400">Räckvidd</span>
                      <Navigation size={16} className="text-green-400" />
                    </div>
                    <p className="font-mono text-lg">{fuelData.vehicle_fuel_history.predictions.estimated_range} km</p>
                    <p className="text-xs text-gray-400">Baserat på körprofil</p>
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-orange-500" />
                      <span className="text-sm text-orange-400">Privacy Note</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Alla prediktioner baseras på anonymiserad fordonsdata. Ingen personlig platsinformation lagras.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'privacy' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Data Controls */}
            <div className="bg-gray-800 rounded-lg shadow-md border-l-4 border-red-500">
              <PrivacyHeader type="personal" title="Persondata Kontroller">
                <PrivacyIndicator type="personal" retention="7 år" gdprStatus={true} />
              </PrivacyHeader>
              
              <div className="p-6 space-y-6">
                <div className="bg-red-900 bg-opacity-20 p-4 rounded border border-red-400">
                  <h4 className="text-red-400 font-medium mb-3">Krypterad Data</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Betalningsinformation:</span>
                      <span className="font-mono text-sm">{personalData.encrypted.payment_method_masked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Kontaktuppgifter:</span>
                      <span className="font-mono text-sm">{personalData.encrypted.contact_masked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Senaste åtkomst:</span>
                      <span className="font-mono text-sm">{personalData.encrypted.last_access}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-red-400 font-medium">GDPR Rättigheter</h4>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded flex items-center justify-center">
                    <Download size={16} className="mr-2" />
                    Exportera All Persondata
                  </button>
                  <button className="w-full bg-red-800 hover:bg-red-900 text-white py-3 px-4 rounded flex items-center justify-center">
                    <AlertTriangle size={16} className="mr-2" />
                    Radera Persondata (Irreversibelt)
                  </button>
                </div>
                
                <div className="bg-blue-900 bg-opacity-20 p-3 rounded">
                  <p className="text-sm text-blue-400">
                    <Check size={16} className="inline mr-1" />
                    Fordonshistoriken påverkas INTE av GDPR-radering och följer bilen permanent.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Vehicle Data Information */}
            <div className="bg-gray-800 rounded-lg shadow-md border-l-4 border-green-500">
              <PrivacyHeader type="vehicle" title="Fordonsdata (Permanent)">
                <PrivacyIndicator type="vehicle" retention="Evighetsförvar" />
              </PrivacyHeader>
              
              <div className="p-6 space-y-6">
                <div className="bg-green-900 bg-opacity-20 p-4 rounded border border-green-400">
                  <h4 className="text-green-400 font-medium mb-3">Anonymiserad Data</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Bränslehistorik:</span>
                      <span className="text-green-400">89 tankningar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tekniska mätningar:</span>
                      <span className="text-green-400">247 datapunkter</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Verifieringsnivå:</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-orange-500" fill="currentColor" />
                        <span>{vehicleData.permanent.verification_level}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-green-400 font-medium">Datasäkerhet</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <Infinity size={24} className="mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-gray-400">Permanent Lagring</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <Shield size={24} className="mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-gray-400">Anonymiserad</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-900 bg-opacity-20 p-3 rounded">
                  <p className="text-sm text-blue-400">
                    <Database size={16} className="inline mr-1" />
                    Denna data följer fordonet och överförs automatiskt till nästa ägare vid försäljning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div className="bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-green-500">
            <PrivacyHeader type="vehicle" title="Avancerad Analys (Anonymiserad Data)">
              <PrivacyIndicator type="vehicle" retention="Permanent" />
            </PrivacyHeader>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded">
                    <h4 className="text-green-400 font-medium mb-3">Förbrukningseffektivitet</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Genomsnitt (12 mån):</span>
                        <span className="font-mono">{fuelData.vehicle_fuel_history.statistics.average_consumption} l/100km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Bästa mätning:</span>
                        <span className="font-mono text-green-400">{fuelData.vehicle_fuel_history.statistics.highway_driving} l/100km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Potential förbättring:</span>
                        <span className="font-mono text-orange-400">-12%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900 bg-opacity-20 p-4 rounded">
                    <h4 className="text-blue-400 font-medium mb-3">Miljöpåverkan</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">CO₂ per år:</span>
                        <span className="font-mono">{(fuelData.vehicle_fuel_history.statistics.co2_emissions * fuelData.vehicle_fuel_history.statistics.yearly_distance / 1000).toFixed(0)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">vs Genomsnitt:</span>
                        <span className="font-mono text-green-400">-15%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded">
                  <h4 className="text-orange-400 font-medium mb-3">AI-Rekommendationer</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Fortsätt med nuvarande körstil - mycket effektiv förbrukning</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Optimera stadskörning genom mjukare acceleration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Potential för 8% förbättring i stadsmiljö</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 p-4 border-t border-gray-800 text-center text-gray-400 text-xs">
        <div className="flex justify-center items-center gap-4">
          <span>CaiZen Bränslehantering v2.0</span>
          <PrivacyIndicator type="vehicle" retention="Permanent" gdprStatus={true} />
          <span>Privacy by Design</span>
        </div>
      </footer>
    </div>
  );
};

export default FuelManagementDashboardV2;
