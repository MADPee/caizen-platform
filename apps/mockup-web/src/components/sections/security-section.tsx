
import { Shield, CheckCircle, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SecuritySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Datasäkerhet</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-automotive-darker border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-white">Kryptering</h3>
            </div>
            <p className="text-automotive-silver mb-4">
              All din fordonsdata skyddas med AES-256 kryptering - samma standard som används av banker och militären.
            </p>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <div className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Aktiv säkerhet</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-automotive-darker border-automotive-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Database className="w-8 h-8 text-automotive-blue mr-3" />
              <h3 className="text-xl font-semibold text-white">Data Separation</h3>
            </div>
            <p className="text-automotive-silver mb-4">
              Persondata och fordonsdata lagras separat. Persondata kan raderas enligt GDPR, fordonsdata anonymiseras permanent.
            </p>
            <div className="bg-automotive-blue/10 p-3 rounded-lg">
              <div className="flex items-center text-automotive-blue text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>GDPR-kompatibel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-automotive-darker border-automotive-orange/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Säkerhetsprinciper</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-automotive-silver">Zero-trust arkitektur</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-automotive-silver">End-to-end kryptering</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-automotive-silver">Automatisk datamaskning</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-automotive-silver">Privacy by design</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
