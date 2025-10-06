
import { Car, Shield, BarChart3, Settings, Plus, MapPin, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "vehicles", label: "Mina Fordon", icon: Car },
  { id: "fuel", label: "Energianalys", icon: Zap },
  { id: "marketplace", label: "Marknadsplats", icon: MapPin },
  { id: "ocr", label: "Smart OCR", icon: Cpu },
  { id: "security", label: "Datasäkerhet", icon: Shield },
  { id: "settings", label: "Inställningar", icon: Settings },
];

export function DashboardSidebar({ activeTab, onTabChange, className }: SidebarProps) {
  return (
    <div className={cn("bg-automotive-darker border-r border-automotive-blue/20 w-64 p-4", className)}>
      <div className="space-y-2 mb-6">
        <Button 
          className="w-full bg-automotive-orange hover:bg-automotive-orange/80 text-white font-semibold"
          onClick={() => onTabChange("add-vehicle")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Lägg till Fordon
        </Button>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left",
                isActive
                  ? "bg-automotive-blue/20 text-automotive-blue border border-automotive-blue/30"
                  : "text-automotive-silver hover:bg-automotive-blue/10 hover:text-automotive-blue"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="mt-8 p-3 bg-automotive-blue/10 rounded-lg border border-automotive-blue/20">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-automotive-blue animate-security-pulse" />
          <span className="text-sm font-medium text-automotive-blue">Säkerhetsstatus</span>
        </div>
        <p className="text-xs text-automotive-silver">
          All fordonsdata är krypterad med militärgrad säkerhet
        </p>
      </div>
    </div>
  );
}
