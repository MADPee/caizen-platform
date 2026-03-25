import { useState } from "react";
import VehicleRegistration from "./components/vehicle/VehicleRegistration";
import PriceDashboard from "./components/price/PriceDashboard";
import ShoppingListView from "./components/shopping/ShoppingListView";
import { useShoppingList } from "./lib/hooks/useShoppingList";
import type { Vehicle, CreateType } from "./types";
import { Car, BarChart3, ShoppingCart, CheckCircle, X } from "lucide-react";

type AppView = "vehicles" | "prices" | "shopping";

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentView, setCurrentView] = useState<AppView>("vehicles");

  const {
    activeList,
    isLoading: isShoppingLoading,
    itemCount,
    notification,
    addToList,
    updateItemStatus,
    updateItemQuantity,
    removeItem,
    clearNotification,
  } = useShoppingList();

  const handleVehicleCreated = async (vehicleData: CreateType<Vehicle>) => {
    console.log("Nytt fordon registrerat:", vehicleData);

    const newVehicle: Vehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setVehicles((prev) => [...prev, newVehicle]);
    alert("Fordon registrerat! Se konsolen för detaljer.");
  };

  const handleValidationError = (error: string) => {
    alert(error);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10 shadow-md">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <Car size={18} />
              </div>
              <h1 className="text-xl font-semibold">
                <span className="text-blue-500">Cai</span>
                <span className="text-orange-500">Zen</span>
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentView("vehicles")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentView === "vehicles"
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Car size={16} />
                Fordon
              </button>
              <button
                onClick={() => setCurrentView("prices")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentView === "prices"
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <BarChart3 size={16} />
                Prisjämförelse
              </button>
              <button
                onClick={() => setCurrentView("shopping")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors relative ${
                  currentView === "shopping"
                    ? "bg-orange-600/20 text-orange-400 font-medium"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <ShoppingCart size={16} />
                Inköpslista
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Notification toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${
              notification.type === "success"
                ? "bg-green-900/90 border-green-700 text-green-300"
                : "bg-red-900/90 border-red-700 text-red-300"
            }`}
          >
            <CheckCircle size={16} />
            <span className="text-sm">{notification.message}</span>
            <button
              onClick={clearNotification}
              className="ml-2 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {currentView === "vehicles" && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Välkommen till CaiZen
                </h2>
                <p className="text-gray-400">
                  Säker fordonshantering med privacy-first design
                </p>
              </div>

              <VehicleRegistration
                onVehicleCreated={handleVehicleCreated}
                onValidationError={handleValidationError}
              />

              {/* Registrerade fordon */}
              {vehicles.length > 0 && (
                <div className="mt-8 card">
                  <h3 className="text-xl font-semibold mb-4">
                    Registrerade fordon
                  </h3>
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </p>
                            <p className="text-sm text-gray-400">
                              Reg: {vehicle.registration.masked} | VIN:{" "}
                              {vehicle.vin.masked}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs px-2 py-1 bg-green-900 text-green-300 rounded">
                              {vehicle.verificationLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {currentView === "prices" && (
            <PriceDashboard onAddToList={addToList} />
          )}

          {currentView === "shopping" && (
            <ShoppingListView
              list={activeList}
              onUpdateStatus={updateItemStatus}
              onUpdateQuantity={updateItemQuantity}
              onRemoveItem={removeItem}
              isLoading={isShoppingLoading}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>CaiZen Platform v2.2 - Säker fordonshantering</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
