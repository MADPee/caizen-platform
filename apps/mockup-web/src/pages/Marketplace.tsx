
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { MarketplaceComingSoon } from "@/components/marketplace/marketplace-coming-soon";

const Marketplace = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === "marketplace") {
      // Already on marketplace, do nothing
      return;
    } else {
      // Navigate back to main app with the selected tab
      navigate(`/?tab=${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-automotive-dark">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <DashboardSidebar
          activeTab="marketplace"
          onTabChange={handleTabChange}
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            transform lg:transform-none transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        />
        
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1">
          <MarketplaceComingSoon />
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
