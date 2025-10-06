import React, { useState } from 'react';
import { Gauge, BarChart3, Calendar, Wrench, Settings, Map, MoreHorizontal, PlusCircle, ChevronRight, Activity, Fuel, DollarSign } from 'lucide-react';

const MyGarage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  
  const vehicles = [
    {
      id: 1,
      name: "BMW E46 M3",
      year: 2001,
      image: "/api/placeholder/800/400",
      healthScore: 87,
      lastMaintenance: "2025-03-15",
      fuelEfficiency: 9.51,
      totalDistance: 67120,
      maintenanceAlert: true,
      maintenanceAlertText: "Oljebyte behövs inom 500 km",
      nextService: "2025-06-10",
      valueEstimate: "195 000 kr",
      modifications: 3,
      valueChange: "+2.5%",
      stats: [
        { name: "Apr", value: 14.23 },
        { name: "Mar", value: 13.9 },
        { name: "Feb", value: 15.1 },
        { name: "Jan", value: 15.3 },
        { name: "Dec", value: 12.7 },
        { name: "Nov", value: 11.2 },
      ]
    },
    {
      id: 2,
      name: "Porsche 911 Carrera",
      year: 2017,
      image: "/api/placeholder/800/400",
      healthScore: 92,
      lastMaintenance: "2025-01-20",
      fuelEfficiency: 10.2,
      totalDistance: 42650,
      maintenanceAlert: false,
      maintenanceAlertText: "",
      nextService: "2025-07-20",
      valueEstimate: "785 000 kr",
      modifications: 1,
      valueChange: "-1.2%",
      stats: [
        { name: "Apr", value: 10.3 },
        { name: "Mar", value: 10.5 },
        { name: "Feb", value: 11.2 },
        { name: "Jan", value: 10.9 },
        { name: "Dec", value: 12.1 },
        { name: "Nov", value: 11.8 },
      ]
    }
  ];
  
  const currentVehicle = vehicles[selectedVehicle];
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">MyCarsJournal</h1>
        <div className="flex items-center space-x-6">
          <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium">Premium Collector</button>
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-lg font-semibold">JS</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Mitt Garage</h2>
          </div>
          
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {vehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id} 
                className={`rounded-lg p-3 cursor-pointer transition duration-200 ${selectedVehicle === index ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => setSelectedVehicle(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-gray-300">{vehicle.year}</p>
                  </div>
                  {vehicle.maintenanceAlert && (
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  )}
                </div>
              </div>
            ))}
            
            <button className="rounded-lg p-3 bg-gray-700 hover:bg-gray-600 w-full text-left flex items-center space-x-2 text-blue-400">
              <PlusCircle size={18} />
              <span>Lägg till fordon</span>
            </button>
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <button className="rounded-lg p-3 bg-gray-700 hover:bg-gray-600 w-full text-left flex items-center justify-between">
              <span>Inställningar</span>
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{currentVehicle.name}</h2>
              <p className="text-gray-400">{currentVehicle.year} • {currentVehicle.totalDistance} km</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                <Wrench size={16} />
                <span>Ny underhållspost</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <img
              src={currentVehicle.image}
              alt={currentVehicle.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          {/* Vehicle Health & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-6 col-span-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Gauge className="mr-2 text-orange-500" size={20} />
                Fordonshälsa
              </h3>
              <div className="flex justify-between items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#374151" 
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke={currentVehicle.healthScore > 80 ? "#22c55e" : currentVehicle.healthScore > 60 ? "#eab308" : "#ef4444"} 
                      strokeWidth="10" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * currentVehicle.healthScore / 100)} 
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)" 
                    />
                    <text 
                      x="50" y="55" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {currentVehicle.healthScore}%
                    </text>
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="rounded-md bg-gray-700 p-3">
                    <p className="text-sm text-gray-300">Nästa service</p>
                    <p className="font-semibold">{currentVehicle.nextService}</p>
                  </div>
                  {currentVehicle.maintenanceAlert && (
                    <div className="rounded-md bg-orange-900/30 border border-orange-700 p-3">
                      <p className="text-sm text-orange-300">{currentVehicle.maintenanceAlertText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 col-span-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Fuel className="mr-2 text-blue-500" size={20} />
                Bränsleförbrukning
              </h3>
              <div className="h-32 pt-2">
                <div className="flex items-end h-full space-x-2">
                  {currentVehicle.stats.map((stat, i) => (
                    <div key={i} className="relative flex-1 flex flex-col items-center group">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {stat.value} l/100km
                      </div>
                      <div 
                        className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-t"
                        style={{ height: `${(stat.value / 20) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-400">{stat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Genomsnitt</p>
                  <p className="font-semibold text-lg">{currentVehicle.fuelEfficiency} l/100km</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                  <span>Visa detaljer</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 col-span-1">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <DollarSign className="mr-2 text-green-500" size={20} />
                Ekonomi
              </h3>
              <div className="space-y-4">
                <div className="rounded-md bg-gray-700 p-3">
                  <p className="text-sm text-gray-300">Uppskattat värde</p>
                  <div className="flex items-center">
                    <p className="font-semibold text-lg">{currentVehicle.valueEstimate}</p>
                    <span className={`ml-2 text-xs ${currentVehicle.valueChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {currentVehicle.valueChange}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-md bg-gray-700 p-3">
                  <p className="text-sm text-gray-300">Senaste 3 månader</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-400">Bränsle</p>
                      <p className="font-semibold">3 240 kr</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Underhåll</p>
                      <p className="font-semibold">1 850 kr</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Övrigt</p>
                      <p className="font-semibold">950 kr</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                  <span>Ekonomirapport</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="mr-3 text-blue-500" size={24} />
                <span>Underhållshistorik</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-3 text-purple-500" size={24} />
                <span>Schemalägg service</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="mr-3 text-orange-500" size={24} />
                <span>Modifieringar</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Map className="mr-3 text-green-500" size={24} />
                <span>Hitta service</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Senaste aktiviteter</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Visa alla</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start border-l-4 border-green-500 pl-4 py-1">
                <div className="flex-1">
                  <p className="font-medium">Oljebyte och filter</p>
                  <p className="text-sm text-gray-400">15 mars 2025 • 67 120 km</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">1 850 kr</p>
                  <p className="text-sm text-gray-400">Servicecenter AB</p>
                </div>
              </div>
              
              <div className="flex items-start border-l-4 border-blue-500 pl-4 py-1">
                <div className="flex-1">
                  <p className="font-medium">Tankning 98 oktan</p>
                  <p className="text-sm text-gray-400">14 mars 2025 • 67 063 km</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">987 kr</p>
                  <p className="text-sm text-gray-400">OKQ8 Södermalm</p>
                </div>
              </div>
              
              <div className="flex items-start border-l-4 border-orange-500 pl-4 py-1">
                <div className="flex-1">
                  <p className="font-medium">Diffbyte installation</p>
                  <p className="text-sm text-gray-400">28 februari 2025 • 66 910 km</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">9 500 kr</p>
                  <p className="text-sm text-gray-400">ModSpeed Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGarage;