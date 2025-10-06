
import { Settings, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Inställningar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-automotive-darker border-automotive-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-automotive-blue mr-3" />
              <h3 className="text-xl font-semibold text-white">Allmänna inställningar</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-automotive-silver">Mörkt tema</span>
                <div className="w-10 h-6 bg-automotive-blue rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-automotive-silver">Notifikationer</span>
                <div className="w-10 h-6 bg-automotive-silver/30 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-automotive-darker border-automotive-orange/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-automotive-orange mr-3" />
              <h3 className="text-xl font-semibold text-white">Om CaiZen</h3>
            </div>
            <div className="space-y-3 text-automotive-silver">
              <p><strong className="text-white">Version:</strong> 1.0.0 Beta</p>
              <p><strong className="text-white">Säkerhetsnivå:</strong> Militärgrad</p>
              <p><strong className="text-white">GDPR-status:</strong> Fullständigt kompatibel</p>
              <p className="text-sm pt-2">
                CaiZen är din kompletta fordonsplattform som kombinerar personlig fordonshantering 
                med en säker marknadsplats och community-funktioner.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
