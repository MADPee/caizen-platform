import React, { useState } from 'react';
import { Menu, X, Bell, User, Car, MapPin, BarChart2, Calendar, Settings, ChevronDown, ChevronRight, Plus } from 'lucide-react';

const CaizenMobileDashboard = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Racing Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button 
              onClick={() => setNavOpen(true)}
              className="mr-3 text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="font-bold">C</span>
              </div>
              <h1 className="text-xl font-bold">
                <span className="text-blue-500">Cai</span>
                <span className="text-orange-500">zen</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm">JD</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="font-bold">C</span>
              </div>
              <h1 className="text-xl font-bold">
                <span className="text-blue-500">Cai</span>
                <span className="text-orange-500">zen</span>
              </h1>
            </div>
            <button 
              onClick={() => setNavOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold">Johan Dahl</p>
                <p className="text-sm text-gray-400">Medlem sedan 2014</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <a href="#" className="flex items-center py-3 px-4 rounded-md bg-blue-900 bg-opacity-20 border-l-4 border-orange-500">
                <BarChart2 size={20} className="mr-3 text-orange-500" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center py-3 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white">
                <Car size={20} className="mr-3" />
                <span>Mina fordon</span>
              </a>
              <a href="#" className="flex items-center py-3 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white">
                <Calendar size={20} className="mr-3" />
                <span>Underhåll</span>
              </a>
              <a href="#" className="flex items-center py-3 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white">
                <MapPin size={20} className="mr-3" />
                <span>Marknadsplats</span>
              </a>
              <a href="#" className="flex items-center py-3 px-4 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white">
                <Settings size={20} className="mr-3" />
                <span>Inställningar</span>
              </a>
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Mina fordon</h3>
                <button className="text-blue-500 text-sm">Visa alla</button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center p-3 rounded-md bg-blue-900 bg-opacity-20">
                  <div className="h-10 w-10 rounded-md flex items-center justify-center bg-blue-600">
                    <Car size={18} />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="font-semibold">BMW E46 M3</p>
                      <span className="text-xs text-orange-500">Aktiv</span>
                    </div>
                    <p className="text-xs text-gray-400">178.412 km • Silver</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-md bg-gray-800">
                  <div className="h-10 w-10 rounded-md flex items-center justify-center bg-gray-700">
                    <Car size={18} />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="font-semibold">Volvo V90 CC</p>
                      <span className="text-xs text-gray-400">Familj</span>
                    </div>
                    <p className="text-xs text-gray-400">45.623 km • Vit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="pb-20">
        {/* Welcome Header */}
        <div className="p-4">
          <h2 className="text-xl font-semibold">Välkommen, Johan</h2>
          <p className="text-sm text-gray-400">Torsdag, 11 April 2025</p>
        </div>
        
        {/* Vehicle Switcher */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md flex items-center justify-center bg-blue-600 mr-3">
                <Car size={18} />
              </div>
              <div>
                <p className="font-semibold">BMW E46 M3</p>
                <p className="text-xs text-gray-400">178.412 km • Silver</p>
              </div>
            </div>
            <button className="text-gray-400">
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
        
        {/* Vehicle Card */}
        <div className="relative mx-4 mb-6 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
          <div className="relative h-40">
            {/* Använder nu den faktiska bilden av BMW E46 M3 på Nürburgring */}
            <div className="w-full h-full bg-cover bg-center brightness-75" 
                 style={{
                   backgroundImage: "url('/api/placeholder/400/160')",
                   backgroundPosition: "center 40%"
                 }}
                 title="BMW E46 M3 på Nürburgring"
            ></div>
            <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black to-transparent w-full">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-bold">BMW E46 M3</h3>
                  <p className="text-xs text-gray-300">2001 • S54 3.2L • 343 hk</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">178.412 km</p>
                  <p className="text-xs text-orange-500">Nästa service: 180.000 km</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vehicle Health Metrics */}
          <div className="p-3">
            <h4 className="font-semibold text-sm mb-3">Fordonshälsa</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-gray-400">Motorhälsa</p>
                  <p className="text-xs font-bold">95%</p>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-gray-400">Bromsar</p>
                  <p className="text-xs font-bold">68%</p>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-gray-400">Batteri</p>
                  <p className="text-xs font-bold">87%</p>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-gray-400">Däck</p>
                  <p className="text-xs font-bold">32%</p>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{width: '32%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mx-4 mb-6">
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Bränsleförbrukning</p>
            <p className="text-lg font-mono text-orange-500">9.51</p>
            <p className="text-xs text-gray-400">l/100km</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Månadskostnad</p>
            <p className="text-lg font-mono">3.240</p>
            <p className="text-xs text-gray-400">kr</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Fordonshälsa</p>
            <p className="text-lg font-mono text-yellow-500">72</p>
            <p className="text-xs text-gray-400">poäng</p>
          </div>
        </div>
        
        {/* Recent Maintenance */}
        <div className="mx-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Senaste service</h3>
            <button className="text-sm text-gray-400">Visa allt</button>
          </div>
          <div className="rounded-lg bg-gray-800 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-start">
                <div className="bg-blue-900 bg-opacity-20 rounded-md p-2 mr-3">
                  <span className="text-blue-500">12/3</span>
                </div>
                <div>
                  <p className="font-medium">Oljebyte & Filterservice</p>
                  <p className="text-xs text-gray-400">177.234 km • Liqui Moly 10W-60</p>
                </div>
              </div>
            </div>
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-start">
                <div className="bg-blue-900 bg-opacity-20 rounded-md p-2 mr-3">
                  <span className="text-blue-500">23/11</span>
                </div>
                <div>
                  <p className="font-medium">Bromsbelägg fram</p>
                  <p className="text-xs text-gray-400">175.612 km • Brembo Sport HP2000</p>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-start">
                <div className="bg-blue-900 bg-opacity-20 rounded-md p-2 mr-3">
                  <span className="text-blue-500">5/9</span>
                </div>
                <div>
                  <p className="font-medium">Kamkedja & Spännare</p>
                  <p className="text-xs text-gray-400">173.780 km • Original BMW</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fuel Consumption Chart */}
        <div className="mx-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Bränsleförbrukning</h3>
            <select className="text-xs bg-gray-700 rounded-md p-1 border border-gray-600">
              <option>12 månader</option>
              <option>6 månader</option>
              <option>30 dagar</option>
            </select>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="h-40 bg-gray-900 bg-opacity-50 rounded-md mb-3 overflow-hidden relative">
              {/* Simplified Chart */}
              <div className="absolute inset-0 flex items-end px-6">
                <div className="w-1/6 h-16 bg-blue-700 bg-opacity-50 rounded-t-sm"></div>
                <div className="w-1/6 h-24 bg-blue-700 bg-opacity-50 rounded-t-sm"></div>
                <div className="w-1/6 h-8 bg-blue-700 bg-opacity-50 rounded-t-sm"></div>
                <div className="w-1/6 h-12 bg-blue-700 bg-opacity-50 rounded-t-sm"></div>
                <div className="w-1/6 h-32 bg-blue-700 bg-opacity-50 rounded-t-sm"></div>
                <div className="w-1/6 h-36 bg-orange-600 bg-opacity-50 rounded-t-sm"></div>
              </div>
              <div className="absolute top-2 left-2">
                <span className="text-xs font-mono text-orange-500">9.51 l/100km</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Förra tankningen</p>
                <p className="text-sm font-mono text-orange-500">14.23 l/100km</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">vs Genomsnitt</p>
                <p className="text-sm font-mono text-red-500">+4.72</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Marketplace Preview */}
        <div className="mx-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Marknadsplats</h3>
            <button className="text-sm text-blue-500">
              <MapPin size={14} className="inline mr-1" />
              Karta
            </button>
          </div>
          <div className="rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <div>
                <p className="font-medium">E46 M3 Coupé</p>
                <p className="text-xs text-gray-400">189.450 km • 2002 • Carbon Black</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold">219.000 kr</p>
                <p className="text-xs text-blue-500">12 km bort</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3">
              <div>
                <p className="font-medium">E46 M3 Cabriolet</p>
                <p className="text-xs text-gray-400">142.120 km • 2003 • Silver</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold">249.000 kr</p>
                <p className="text-xs text-blue-500">23 km bort</p>
              </div>
            </div>
            <div className="p-3 border-t border-gray-700">
              <button className="w-full py-2 text-sm font-medium text-blue-500 flex items-center justify-center">
                <span>Visa fler</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          <a href="#" className="flex flex-col items-center justify-center text-blue-500">
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-gray-500">
            <Car size={20} />
            <span className="text-xs mt-1">Fordon</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center -mt-4">
              <Plus size={24} />
            </div>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-gray-500">
            <MapPin size={20} />
            <span className="text-xs mt-1">Marknad</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-gray-500">
            <Calendar size={20} />
            <span className="text-xs mt-1">Service</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CaizenMobileDashboard;