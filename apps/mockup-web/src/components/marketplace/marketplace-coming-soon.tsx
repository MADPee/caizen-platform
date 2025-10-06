
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Sparkles, Eye, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MarketplaceComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Här skulle vi normalt spara till databas
    console.log("Intresseanmälan:", email);
    
    setIsSubmitted(true);
    setEmail("");
    
    toast({
      title: "Tack för ditt intresse! 🎉",
      description: "Vi hör av oss så fort förhandstitten är redo.",
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-automotive-dark flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-automotive-darker border-automotive-blue/20">
        <CardContent className="p-12 text-center">
          {/* Icon och titel */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <MapPin className="w-16 h-16 text-automotive-blue" />
              <Sparkles className="w-6 h-6 text-automotive-orange absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Framtidens Marknadsplats
          </h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-automotive-silver">
              Vi jobbar på framtidens marknadsplats - en väldigt smart marknadsplats!
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-automotive-blue">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">
                Anmäl ditt intresse här för en förhandstitt
              </span>
            </div>
            
            <p className="text-sm text-automotive-silver">
              Vi säger till när du får titta 🙈
            </p>
          </div>

          {/* Fördelar */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-automotive-blue/10 p-4 rounded-lg border border-automotive-blue/20">
              <div className="text-automotive-blue font-medium mb-1">🗺️ Kartbaserad</div>
              <div className="text-automotive-silver">Hitta fordon nära dig</div>
            </div>
            <div className="bg-automotive-orange/10 p-4 rounded-lg border border-automotive-orange/20">
              <div className="text-automotive-orange font-medium mb-1">🔍 Verifierad data</div>
              <div className="text-automotive-silver">Komplett fordonshistorik</div>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <div className="text-green-400 font-medium mb-1">🛡️ Säker handel</div>
              <div className="text-automotive-silver">Militärgrads säkerhet</div>
            </div>
          </div>

          {/* Email-anmälan */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-automotive-dark border-automotive-blue/30 text-white placeholder:text-automotive-silver"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-automotive-orange hover:bg-automotive-orange/80 text-white font-semibold px-6"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Anmäl intresse
                </Button>
              </div>
              <p className="text-xs text-automotive-silver">
                Vi respekterar din integritet och skickar endast uppdateringar om marknadsplatsen.
              </p>
            </form>
          ) : (
            <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-green-400 font-semibold mb-2">Perfekt!</h3>
              <p className="text-automotive-silver">
                Du är nu registrerad för förhandstitten. Vi hör av oss så fort det är dags!
              </p>
            </div>
          )}

          {/* Bakgrund till CaiZen */}
          <div className="mt-12 pt-8 border-t border-automotive-blue/20">
            <p className="text-xs text-automotive-silver">
              En del av CaiZens säkra fordonsplattform • Militärgrad säkerhet • GDPR-kompatibel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
