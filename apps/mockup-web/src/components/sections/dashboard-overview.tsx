
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityBadge } from "@/components/ui/security-badge";
import { SecurityStatus } from "@/components/ui/security-status";
import { CommunityActivity } from "@/components/ui/community-activity";
import { Progress } from "@/components/ui/progress";
import { QuickEnergyInput } from "@/components/energy/quick-energy-input";
import { Car, Shield, TrendingUp, Database, Users, Fuel } from "lucide-react";

export function DashboardOverview() {
  const stats = [
    {
      title: "Totala Fordon",
      value: "3",
      change: "+1 denna månad",
      icon: Car,
      color: "text-automotive-blue"
    },
    {
      title: "Säkerhetspoäng",
      value: "98%",
      change: "Hög säkerhetsnivå",
      icon: Shield,
      color: "text-green-500"
    },
    {
      title: "Verifierade Fordon",
      value: "2/3",
      change: "Transportstyrelsen OK",
      icon: Database,
      color: "text-automotive-orange"
    },
    {
      title: "Community Aktivitet",
      value: "24",
      change: "Interaktioner denna vecka",
      icon: Users,
      color: "text-automotive-blue"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-automotive-silver">Översikt av dina fordon och aktivitet</p>
      </div>

      {/* Quick Energy Input - Prominent placement */}
      <QuickEnergyInput />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-automotive-darker border-automotive-blue/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-automotive-silver">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-automotive-silver mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-automotive-darker border-automotive-blue/20 security-indicator">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-automotive-blue" />
              Datasäkerhet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SecurityStatus
              lastCheckTime="Idag 14:30"
              incidentCount={0}
              lastBackupTime="6 tim sedan"
            />
            
            <div className="border-t border-automotive-blue/20 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-automotive-silver">Kryptering</span>
                <div className="flex items-center text-xs text-green-500">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Aktiv</span>
                </div>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-automotive-silver">Datamaskning</span>
                <div className="flex items-center text-xs text-automotive-blue">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Aktiv</span>
                </div>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-automotive-darker border-automotive-blue/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-automotive-orange" />
              Community Aktivitet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommunityActivity
              newPosts={3}
              vehicleGroup="BMW M3"
              replies={5}
              trendingTopic="Vinterdäck-diskussion"
            />
            
            <div className="border-t border-automotive-blue/20 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-automotive-blue rounded-full"></div>
                <span className="text-automotive-silver">Fordon BMW*** registrerat</span>
                <span className="text-xs text-automotive-silver ml-auto">2h sedan</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-automotive-silver">Säkerhetsverifiering OK</span>
                <span className="text-xs text-automotive-silver ml-auto">1d sedan</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-automotive-orange rounded-full"></div>
                <span className="text-automotive-silver">Community-inlägg delat</span>
                <span className="text-xs text-automotive-silver ml-auto">3d sedan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-automotive-blue/10 to-automotive-orange/10 border-automotive-blue/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="gauge-border w-16 h-16">
              <div className="gauge-inner flex items-center justify-center">
                <Fuel className="w-8 h-8 text-automotive-blue" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                Välkommen till CaiZen
              </h3>
              <p className="text-automotive-silver text-sm">
                Din kompletta plattform för fordonshantering. Dokumentera, upptäck och handla med trygghet.
              </p>
            </div>
            <div className="flex items-center text-xs text-automotive-silver">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              <span>Säker & privat</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
