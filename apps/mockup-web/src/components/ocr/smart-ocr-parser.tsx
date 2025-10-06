
import { useState, useRef } from 'react';
import { Upload, FileText, Shield, Database, Lock, CheckCircle, AlertTriangle, Eye, EyeOff, Zap, Cpu, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const SmartOCRParser = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [separatedData, setSeparatedData] = useState<any>(null);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Riktig OCR-data från Carspect besiktningsprotokoll
  const mockOCRText = `
Carspect

Besiktningsprotokoll: KONTROLLBESIKTNING

Regnr: JWS127
Fabrikat: BMW 320d CAB M1
Nationalitetsbeteckning: S
Chassinummer: WBAWM3104DE139742
Besiktning utförd: 2024-06-26
Station: Karlstad Kökarlsbyvägen

Nästa besiktning senast: 2025-08-31
Diarienr: 9117 26 6 2024 07.58.41
Vägmätarställning: 108863 km

Historiska mätarställningar:
2023-05-12: 103786 km
2022-06-11: 101706 km
2021-04-01: 99058 km

Bra att veta:
Alternativ kontrollmetod avgasrening, visuell kontroll (konstruktion)

Broms Vänster Höger
Fram  2.4     2.6
Bak   2.2     2.1

Resultat från OBD test:
Deltester    3/3
Antal felkoder: 0

Besiktningsresultat: GODKÄND KONTROLLBESIKTNING

Fordonet har besiktigats av: FORSDAN

CARSPECT AB
Org.nr: 556774-1110
Ulvsundavägen 106 C, 16867 Bromma
www.carspect.se

Kundtjänst: 0771-44 22 33
mail: info@carspect.se
Företag säte: Stockholm
Företaget innehar F-skattebevis
  `;

  const processDocument = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    // Simulera OCR-process
    const steps = [
      { step: 1, message: "Läser dokument med OCR...", delay: 1000 },
      { step: 2, message: "Identifierar datatyper...", delay: 800 },
      { step: 3, message: "Separerar persondata från fordonsdata...", delay: 1200 },
      { step: 4, message: "Krypterar känslig information...", delay: 700 },
      { step: 5, message: "Sparar i separata domäner...", delay: 500 }
    ];

    for (const stepInfo of steps) {
      setProcessingStep(stepInfo.step);
      await new Promise(resolve => setTimeout(resolve, stepInfo.delay));
    }

    // Simulera OCR-resultat
    setOcrResult(mockOCRText);

    // Simulera smart parsing för besiktningsprotokoll
    const separated = {
      personalData: {
        customerName: "Mikael Brolin", // Härledd från köpare (ej i protokoll)
        driverLicenseInfo: null, // Ingen persondata i besiktningsprotokoll
        contactInfo: null,
        paymentMethod: null,
        confidence: 0 // Besiktningsprotokoll innehåller minimal persondata
      },
      vehicleData: {
        vin: "WBAWM3104DE139742",
        registration: "JWS127",
        make: "BMW",
        model: "320d CAB M1",
        nationalityCode: "S",
        inspectionDate: "2024-06-26",
        nextInspectionDate: "2025-08-31",
        odometer: 108863,
        historicalOdometer: [
          { date: "2023-05-12", reading: 103786 },
          { date: "2022-06-11", reading: 101706 },
          { date: "2021-04-01", reading: 99058 }
        ],
        inspectionResult: "GODKÄND KONTROLLBESIKTNING",
        brakeValues: {
          frontLeft: 2.4,
          frontRight: 2.6,
          rearLeft: 2.2,
          rearRight: 2.1
        },
        obdTest: {
          deltestsCompleted: "3/3",
          errorCodes: 0,
          passed: true
        },
        inspectionNotes: "Alternativ kontrollmetod avgasrening, visuell kontroll (konstruktion)",
        inspectionStation: {
          name: "Carspect AB",
          location: "Karlstad Kökarlsbyvägen",
          orgNumber: "556774-1110",
          inspector: "FORSDAN"
        },
        confidence: 99
      },
      metadata: {
        documentType: "inspection_protocol",
        processingTime: "2.8s",
        requiresManualReview: false,
        documentHash: "sha256:carspect_jws127_20240626",
        diaryNumber: "9117 26 6 2024 07.58.41"
      }
    };

    setSeparatedData(separated);
    setIsProcessing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setOcrResult(null);
      setSeparatedData(null);
      setProcessingStep(0);
    }
  };

  const maskPersonalData = (data: any) => {
    return {
      ...data,
      customerName: data.customerName ? "Mikael B*****" : "Ingen persondata",
      contactInfo: data.contactInfo ? "***-***" : "Ej tillämpligt",
      driverLicenseInfo: "Ej tillämpligt",
      paymentMethod: "Ej tillämpligt"
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 bg-automotive-blue rounded-lg flex items-center justify-center mr-4">
            <Cpu size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-automotive-blue">Smart OCR</span>
            <span className="text-automotive-orange"> Parser</span>
          </h1>
        </div>
        <div className="h-1 bg-racing-stripe w-full max-w-md mx-auto"></div>
        <p className="text-automotive-silver mt-4">Smart parsing av BMW 320d CAB M1 besiktningsprotokoll</p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-automotive-darker border-automotive-blue/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
              <Upload className="mr-2 text-automotive-blue" size={20} />
              Ladda upp kvitto/faktura
            </h2>
            
            <div 
              className="border-2 border-dashed border-automotive-blue/30 rounded-lg p-8 text-center cursor-pointer hover:border-automotive-blue transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText size={48} className="mx-auto mb-4 text-automotive-silver" />
              <p className="text-automotive-silver mb-2">Klicka för att ladda upp eller dra och släpp</p>
              <p className="text-sm text-automotive-silver/70">Stöder: JPG, PNG, PDF (Exempel: Carspect besiktningsprotokoll)</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
              />
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-automotive-dark rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 text-green-500" size={16} />
                    <span className="font-medium text-white">{uploadedFile.name}</span>
                  </div>
                  <span className="text-sm text-automotive-silver">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="mt-2 text-xs text-automotive-silver">
                  BMW 320d CAB M1 • JWS127 • Carspect besiktningsprotokoll
                </div>
                
                <button
                  onClick={processDocument}
                  disabled={isProcessing}
                  className="w-full mt-4 bg-automotive-blue hover:bg-automotive-blue/90 disabled:bg-automotive-silver/20 text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="animate-spin mr-2" size={16} />
                      Bearbetar...
                    </>
                  ) : (
                    <>
                      <Cpu className="mr-2" size={16} />
                      Starta Smart Parsing
                    </>
                  )}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Status */}
        <Card className="bg-automotive-darker border-automotive-blue/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
              <Zap className="mr-2 text-automotive-orange" size={20} />
              Bearbetningsstatus
            </h2>

            <div className="space-y-4">
              {[
                { step: 1, label: "OCR-avläsning", icon: Eye },
                { step: 2, label: "Dataidentifiering", icon: Cpu },
                { step: 3, label: "Smart separering", icon: Shield },
                { step: 4, label: "Kryptering", icon: Lock },
                { step: 5, label: "Säker lagring", icon: Database }
              ].map(({ step, label, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    processingStep >= step ? 'bg-green-600' : 
                    processingStep === step - 1 && isProcessing ? 'bg-automotive-orange animate-pulse' : 
                    'bg-automotive-silver/20'
                  }`}>
                    {processingStep >= step ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Icon size={16} />
                    )}
                  </div>
                  <span className={processingStep >= step ? 'text-green-400' : 'text-automotive-silver'}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {isProcessing && (
              <div className="mt-4 p-4 bg-automotive-orange/10 rounded-lg">
                <div className="flex items-center">
                  <Clock className="mr-2 text-automotive-orange" size={16} />
                  <span className="text-automotive-orange">
                    Steg {processingStep}/5 - Intelligent AI-analys pågår...
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {separatedData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Data (Encrypted) */}
            <Card className="bg-automotive-darker border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center text-white">
                    <Lock className="mr-2 text-red-500" size={20} />
                    Persondata (Krypterat)
                  </h2>
                  <button
                    onClick={() => setShowPersonalData(!showPersonalData)}
                    className="flex items-center text-automotive-silver hover:text-white"
                  >
                    {showPersonalData ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="ml-1">{showPersonalData ? 'Dölj' : 'Visa'}</span>
                  </button>
                </div>

                <div className="bg-red-500/10 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 text-red-500" size={16} />
                    <span className="text-red-400">Känslig data - Krypteras och lagras separat</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(showPersonalData ? separatedData.personalData : maskPersonalData(separatedData.personalData)).map(([key, value]) => {
                    if (key === 'confidence') return null;
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-automotive-silver capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-mono text-sm bg-automotive-dark px-2 py-1 rounded text-white">
                          {String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-automotive-dark rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-automotive-silver">Parsing-säkerhet:</span>
                    <span className="text-green-400 font-bold">{separatedData.personalData.confidence}%</span>
                  </div>
                  <div className="w-full bg-automotive-silver/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${separatedData.personalData.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-automotive-silver/70">
                  🔒 Lagras i: personal_encrypted.user_data<br/>
                  ⏰ Retention: 7 år (automatisk radering)<br/>
                  🗑️ GDPR: Kan raderas när som helst
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Data (Permanent) */}
            <Card className="bg-automotive-darker border-green-500/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <Database className="mr-2 text-green-500" size={20} />
                  Fordonsdata (Evighetsförvar)
                </h2>

                <div className="bg-green-500/10 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    <span className="text-green-400">Anonymiserad data - Säker att dela</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-automotive-silver mb-2">Fordonsidentifiering</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-automotive-silver">VIN:</span>
                        <span className="font-mono text-white">WBA***********742</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-automotive-silver">Reg.nr:</span>
                        <span className="font-mono text-white">JWS***</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-automotive-silver">Modell:</span>
                        <span className="text-white">BMW 320d CAB M1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-automotive-silver">Mätarställning:</span>
                        <span className="text-white">108,863 km</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-automotive-silver mb-2">Besiktningsresultat</h4>
                    <div className="bg-green-500/20 p-3 rounded text-sm">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        <span className="text-green-400 font-medium">GODKÄND KONTROLLBESIKTNING</span>
                      </div>
                      <div className="space-y-1 text-automotive-silver">
                        <div>Besiktningsdatum: {separatedData.vehicleData.inspectionDate}</div>
                        <div>Nästa besiktning: {separatedData.vehicleData.nextInspectionDate}</div>
                        <div>Besiktningsstation: {separatedData.vehicleData.inspectionStation.location}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-automotive-silver mb-2">Tekniska värden</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-automotive-silver text-sm">Bromsvärden</span>
                        <div className="bg-automotive-dark p-3 rounded text-sm mt-1">
                          <div className="grid grid-cols-2 gap-2 text-white">
                            <div>Fram: {separatedData.vehicleData.brakeValues.frontLeft} / {separatedData.vehicleData.brakeValues.frontRight}</div>
                            <div>Bak: {separatedData.vehicleData.brakeValues.rearLeft} / {separatedData.vehicleData.brakeValues.rearRight}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-automotive-silver text-sm">OBD-test</span>
                        <div className="bg-automotive-dark p-3 rounded text-sm mt-1">
                          <div className="flex items-center text-white">
                            <CheckCircle className="text-green-500 mr-2" size={14} />
                            <span>Deltester: {separatedData.vehicleData.obdTest.deltestsCompleted}</span>
                          </div>
                          <div className="text-white">Felkoder: {separatedData.vehicleData.obdTest.errorCodes}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-automotive-silver mb-2">Historiska mätarställningar</h4>
                    <div className="space-y-1 text-sm">
                      {separatedData.vehicleData.historicalOdometer.map((reading: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-automotive-silver">{reading.date}:</span>
                          <span className="text-white">{reading.reading.toLocaleString()} km</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-automotive-dark rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-automotive-silver">Data-kvalitet:</span>
                    <span className="text-green-400 font-bold">{separatedData.vehicleData.confidence}%</span>
                  </div>
                  <div className="w-full bg-automotive-silver/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${separatedData.vehicleData.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-automotive-silver/70">
                  💾 Lagras i: vehicle_permanent.service_events<br/>
                  ♾️ Retention: Permanent (följer bilen)<br/>
                  🔄 GDPR: Anonymiserad, kan ej raderas
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card className="bg-automotive-darker border-automotive-blue/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <Shield className="mr-2 text-automotive-blue" size={20} />
                Privacy-First Resultat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-500/10 p-4 rounded-lg text-center">
                  <Lock className="mx-auto mb-2 text-red-500" size={24} />
                  <h3 className="font-medium text-red-400">Persondata</h3>
                  <p className="text-2xl font-bold text-red-400">Krypterat</p>
                  <p className="text-sm text-automotive-silver mt-1">Kan raderas (GDPR)</p>
                </div>

                <div className="bg-green-500/10 p-4 rounded-lg text-center">
                  <Database className="mx-auto mb-2 text-green-500" size={24} />
                  <h3 className="font-medium text-green-400">Fordonsdata</h3>
                  <p className="text-2xl font-bold text-green-400">Permanent</p>
                  <p className="text-sm text-automotive-silver mt-1">Följer bilen för alltid</p>
                </div>

                <div className="bg-automotive-blue/10 p-4 rounded-lg text-center">
                  <Shield className="mx-auto mb-2 text-automotive-blue" size={24} />
                  <h3 className="font-medium text-automotive-blue">Integritet</h3>
                  <p className="text-2xl font-bold text-automotive-blue">100%</p>
                  <p className="text-sm text-automotive-silver mt-1">Privacy by Design</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-automotive-blue/10 rounded-lg">
                <h4 className="font-medium text-automotive-blue mb-2">🎯 Uppnådda mål (Besiktningsprotokoll):</h4>
                <ul className="text-sm text-automotive-silver space-y-1">
                  <li>✅ Automatisk identifiering av officiellt besiktningsprotokoll</li>
                  <li>✅ Minimal persondata = Optimal GDPR-compliance</li>
                  <li>✅ Rik fordonshistorik med bromsvärden och OBD-data</li>
                  <li>✅ {separatedData.metadata.processingTime} bearbetningstid</li>
                  <li>✅ {separatedData.vehicleData.confidence}% parsing-säkerhet</li>
                  <li>✅ Historiska mätarställningar bevarade</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SmartOCRParser;
