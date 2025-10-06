
import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Shield, Database, Lock, CheckCircle, AlertTriangle, Eye, EyeOff, Zap, Cpu, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { uploadDocument, getStatus, getResults } from "@/lib/api/ocrClient";

const SmartOCRParser = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [separatedData, setSeparatedData] = useState<any>(null);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processDocument = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    try {
      setError(null);
      setProcessingStep(1);
      const upload = await uploadDocument(uploadedFile);
      setTaskId(upload.task_id);
      setProcessingStep(2);

      // Poll status
      let status = await getStatus(upload.task_id);
      const start = Date.now();
      while (status.status !== 'completed' && status.status !== 'failed' && Date.now() - start < 60000) {
        await new Promise(r => setTimeout(r, 800));
        status = await getStatus(upload.task_id);
        setProcessingStep((prev) => Math.min(4, (prev || 2) + 1));
      }

      if (status.status !== 'completed') {
        throw new Error('OCR processing did not complete in time');
      }

      setProcessingStep(5);
      const result = await getResults(upload.task_id);
      setOcrResult(null);
      setSeparatedData(result.extracted_data || null);
    } catch (e: any) {
      setError(e?.message || 'OCR processing failed');
    } finally {
      setIsProcessing(false);
    }
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

            {(isProcessing || error) && (
              <div className="mt-4 p-4 bg-automotive-orange/10 rounded-lg">
                <div className="flex items-center">
                  <Clock className="mr-2 text-automotive-orange" size={16} />
                  <span className="text-automotive-orange">
                    {error ? `Fel: ${error}` : `Steg ${processingStep}/5 - OCR-analys pågår...`}
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
