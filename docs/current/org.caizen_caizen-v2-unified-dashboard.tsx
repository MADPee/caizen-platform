import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Unlock, Download, Share2, Settings, AlertCircle, CheckCircle, Clock, Droplet, Navigation, TrendingDown, MapPin, Fuel, Calendar } from 'lucide-react';

const CaizenV2Dashboard = () => {
  const [privacyMode, setPrivacyMode] = useState('masked'); // 'masked', 'visible', 'full'
  const [activeView, setActiveView] = useState('overview');
  const [showGDPRInfo, setShowGDPRInfo] = useState(false);

  // Privacy utilities
  const maskVIN = (vin) => privacyMode === 'full' ? vin : `${vin.slice(0, 3)}***********${vin.slice(-4)}`;
  const maskReg = (reg) => privacyMode === 'full' ? reg : `${reg.slice(0, 3)}***`;
  const maskStation = (station) => privacyMode === 'masked' ? station.split(' ')[0] + ' ***' : station;

  // Vehicle data (permanent, follows VIN)
  const vehicleData = {
    vin: "WBA2D3107G5C64424",
    registration: "MKN510",
    model: "BMW 218i GRAN TOURER",
    color: "GRÅ",
    inspectionHistory: [
      { date: "2025-04-17", status: "Godkänd", odometer: 165618, nextDue: "2026-06-30" }
    ],
    environmentalData: {
      co2: 0.0, co2Limit: 0.3,
      hc: 0, hcLimit: 200,
      lambda: 1.01, lambdaRange: [0.97, 1.03]
    },
    fuelHistory: [
      { date: "2025-04-18", amount: 35.44, odometer: 166216, distance: 579, consumption: 6.12 },
      { date: "2025-04-17", amount: 44.11, odometer: 165637, distance: 1437, consumption: 8.3 }
    ]
  };

  // Personal data (encrypted, temporary, GDPR-deletable)
  const personalData = {
    owner: "Current Owner",
    ownershipStart: "2024-01-15",
    preferences: { notifications: true, dataSharing: false }
  };

  // Latest refueling with mixed data
  const latestRefuel = {
    station: "Preem Haninge Vendelsövägen", // Personal
    price: 15.49, // Vehicle-relevant
    cost: 548.97, // Personal
    paymentMethod: "Mastercard ***3052" // Personal
  };

  const stats = {
    actualConsumption: 6.12,
    computerConsumption: 5.9,
    co2PerKm: 141.4,
    cityConsumption: 7.3,
    highwayConsumption: 5.9
  };

  const PrivacyBadge = ({ type }) => {
    const configs = {
      personal: { bg: 'bg-red-900/20', border: 'border-red-500', text: 'text-red-400', icon: Lock },
      vehicle: { bg: 'bg-green-900/20', border: 'border-green-500', text: 'text-green-400', icon: Shield },
      mixed: { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: AlertCircle }
    };
    const config = configs[type];
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${config.bg} ${config.border} border ${config.text}`}>
        <Icon size={12} className="mr-1" />
        {type === 'personal' ? 'Persondata' : type === 'vehicle' ? 'Fordonsdata' : 'Blandat'}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* GDPR Info Modal */}
      {showGDPRInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Shield className="text-blue-400 mr-2" size={24} />
                Privacy by Design v2.0
              </h3>
              <button onClick={() => setShowGDPRInfo(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                  <div className="flex items-center mb-2">
                    <Shield className="text-green-400 mr-2" size={16} />
                    <span className="font-semibold text-green-400">Fordonsdata</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>• Sparas permanent med bilen</li>
                    <li>• Följer VIN-numret</li>
                    <li>• Överlever ägarbyten</li>
                    <li>• Anonymiserad automatiskt</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                  <div className="flex items-center mb-2">
                    <Lock className="text-red-400 mr-2" size={16} />
                    <span className="font-semibold text-red-400">Persondata</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li>• AES-256 krypterad</li>
                    <li>• Kan raderas när som helst</li>
                    <li>• 7 års retention</li>
                    <li>• GDPR-kompatibel</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-300 text-center mt-4">
                <strong>Omöjligt att läcka persondata</strong> från fordonshistorik
              </p>
            </div>
            <button onClick={() => setShowGDPRInfo(false)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
              Förstått
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 z-10 bg-gray-900/95 backdrop-blur">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">C</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  <span className="text-blue-400">Cai</span><span className="text-orange-500">Zen</span>
                  <span className="text-xs text-gray-400 ml-2">v2.0</span>
                </h1>
                <p className="text-xs text-gray-400">Privacy-First Fordonsplattform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowGDPRInfo(true)}
                className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                title="Privacy Information"
              >
                <Shield size={20} />
              </button>
              
              <div className="flex items-center bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setPrivacyMode('masked')}
                  className={`p-1.5 rounded ${privacyMode === 'masked' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                  title="Maskerad"
                >
                  <EyeOff size={16} />
                </button>
                <button 
                  onClick={() => setPrivacyMode('visible')}
                  className={`p-1.5 rounded ${privacyMode === 'visible' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                  title="Synlig"
                >
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => setPrivacyMode('full')}
                  className={`p-1.5 rounded ${privacyMode === 'full' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                  title="Full åtkomst"
                >
                  <Unlock size={16} />
                </button>
              </div>
              
              <button className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white">
                <Download size={20} />
              </button>
              <button className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Vehicle Identity Card */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-semibold">{vehicleData.model}</h2>
                <PrivacyBadge type="vehicle" />
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>VIN: <span className="font-mono">{maskVIN(vehicleData.vin)}</span></span>
                <span>Reg: <span className="font-mono">{maskReg(vehicleData.registration)}</span></span>
                <span>{vehicleData.color}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Mätarställning</div>
              <div className="text-2xl font-mono">{vehicleData.fuelHistory[0].odometer}</div>
              <div className="text-xs text-gray-400">km</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-700">
            <div>
              <div className="text-xs text-gray-400">Förbrukning</div>
              <div className="text-lg font-mono text-orange-500">{stats.actualConsumption} L</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">CO₂-utsläpp</div>
              <div className="text-lg font-mono text-green-500">{stats.co2PerKm} g/km</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Besiktning</div>
              <div className="text-lg font-mono text-green-500">Godkänd</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Nästa besiktning</div>
              <div className="text-lg font-mono">{Math.ceil((new Date(vehicleData.inspectionHistory[0].nextDue) - new Date()) / (1000*60*60*24))}d</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Refueling - Mixed Data */}
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold flex items-center">
                <Fuel className="mr-2 text-yellow-500" size={20} />
                Senaste tankningen
              </h3>
              <PrivacyBadge type="mixed" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Station</span>
                <span className="font-mono text-sm">{maskStation(latestRefuel.station)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Mängd (Fordonsdata)</span>
                <span className="font-mono text-green-400">{vehicleData.fuelHistory[0].amount} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Pris per liter</span>
                <span className="font-mono">{latestRefuel.price} kr</span>
              </div>
              {privacyMode === 'full' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Kostnad (Persondata)</span>
                    <span className="font-mono text-red-400">{latestRefuel.cost} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Betalning</span>
                    <span className="font-mono text-xs">{latestRefuel.paymentMethod}</span>
                  </div>
                </>
              )}
              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Körsträcka sedan förra</span>
                  <span className="font-mono text-lg text-blue-400">{vehicleData.fuelHistory[0].distance} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Consumption Analysis - Vehicle Data */}
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold flex items-center">
                <Droplet className="mr-2 text-green-500" size={20} />
                Förbrukningsanalys
              </h3>
              <PrivacyBadge type="vehicle" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Faktisk</span>
                  <span className="font-mono text-orange-500">{stats.actualConsumption} L/100km</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{width: `${(stats.actualConsumption/12)*100}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Färddator</span>
                  <span className="font-mono">{stats.computerConsumption} L/100km</span>
                </div>
                <div className="text-xs text-gray-400">
                  Avvikelse: {Math.abs(((stats.computerConsumption - stats.actualConsumption)/stats.actualConsumption)*100).toFixed(1)}%
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-400">Stad</span>
                  <span className="text-xs font-mono">{stats.cityConsumption} L/100km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Motorväg</span>
                  <span className="text-xs font-mono text-green-400">{stats.highwayConsumption} L/100km</span>
                </div>
              </div>

              <div className="bg-green-900/20 rounded p-2 text-xs flex items-start">
                <CheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={14} />
                <span>Exceptionell förbrukning - {Math.round(((7.8-stats.actualConsumption)/7.8)*100)}% under genomsnitt</span>
              </div>
            </div>
          </div>

          {/* Environmental Impact - Vehicle Data */}
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold flex items-center">
                <Navigation className="mr-2 text-green-500" size={20} />
                Miljöpåverkan
              </h3>
              <PrivacyBadge type="vehicle" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">CO₂-utsläpp per km</div>
                <div className="text-2xl font-mono text-green-400">{stats.co2PerKm} g</div>
                <div className="text-xs text-gray-400">Beräknat enligt Naturvårdsverket 2023</div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-2">Besiktningsvärden</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">CO₂</span>
                    <span className="text-xs font-mono">{vehicleData.environmentalData.co2}% / {vehicleData.environmentalData.co2Limit}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{width: '1%'}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs">HC</span>
                    <span className="text-xs font-mono">{vehicleData.environmentalData.hc}ppm / {vehicleData.environmentalData.hcLimit}ppm</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{width: '1%'}}></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 rounded p-2 text-xs flex items-start">
                <CheckCircle className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={14} />
                <span>Optimala miljövärden bekräftar låg förbrukning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel History - Vehicle Data */}
        <div className="bg-gray-800 rounded-lg p-4 mt-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Tankningshistorik</h3>
            <PrivacyBadge type="vehicle" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-xs text-gray-400">Datum</th>
                  <th className="text-right py-2 text-xs text-gray-400">Mängd</th>
                  <th className="text-right py-2 text-xs text-gray-400">Mätarställning</th>
                  <th className="text-right py-2 text-xs text-gray-400">Körsträcka</th>
                  <th className="text-right py-2 text-xs text-gray-400">Förbrukning</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.fuelHistory.map((fuel, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 font-mono text-xs">{fuel.date}</td>
                    <td className="text-right font-mono">{fuel.amount} L</td>
                    <td className="text-right font-mono">{fuel.odometer} km</td>
                    <td className="text-right font-mono">{fuel.distance} km</td>
                    <td className="text-right font-mono text-green-400">{fuel.consumption} L/100km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Footer */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-blue-400 mr-3" size={24} />
              <div>
                <div className="font-semibold text-sm">Privacy by Design v2.0</div>
                <div className="text-xs text-gray-400">
                  Fordonsdata följer VIN • Persondata krypterad • GDPR-kompatibel
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowGDPRInfo(true)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Läs mer →
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-8 py-4 text-center text-xs text-gray-400">
        <p>CaiZen v2.0 • Privacy-First Fordonsplattform • 2025-05-30</p>
      </footer>
    </div>
  );
};

export default CaizenV2Dashboard;