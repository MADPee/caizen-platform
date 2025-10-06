
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardOverview } from "@/components/sections/dashboard-overview";
import { VehiclesSection } from "@/components/sections/vehicles-section";
import { SecuritySection } from "@/components/sections/security-section";
import { SettingsSection } from "@/components/sections/settings-section";
import SmartOCRParser from "@/components/ocr/smart-ocr-parser";
import { EnergyAnalysisDashboard } from "@/components/energy/energy-analysis-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Handle tab parameter from URL when navigating from marketplace
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
      // Clean up URL by removing the tab parameter
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleTabChange = (tab: string) => {
    if (tab === "marketplace") {
      navigate("/marketplace");
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "vehicles":
        return <VehiclesSection />;
      case "fuel":
        return <EnergyAnalysisDashboard />;
      case "security":
        return <SecuritySection />;
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analys</h2>
            <Card className="bg-automotive-darker border-automotive-blue/20">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-automotive-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Analys kommer snart</h3>
                <p className="text-automotive-silver">
                  Detaljerad analys av dina fordons prestanda och kostnader
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return <SettingsSection />;
      case "ocr":
        return <SmartOCRParser />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-automotive-dark">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            transform lg:transform-none transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
