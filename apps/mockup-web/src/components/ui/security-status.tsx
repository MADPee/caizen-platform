
import { Shield, CheckCircle, Clock, Database } from "lucide-react";
import { SecurityBadge } from "@/components/ui/security-badge";

interface SecurityStatusProps {
  lastCheckTime: string;
  incidentCount: number;
  lastBackupTime: string;
  className?: string;
}

export function SecurityStatus({ lastCheckTime, incidentCount, lastBackupTime, className }: SecurityStatusProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-automotive-blue" />
          <span className="text-automotive-silver">Senaste säkerhetscheck:</span>
        </div>
        <span className="text-white font-medium">{lastCheckTime}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-automotive-silver">Säkerhetsincidenter:</span>
        </div>
        <div className="flex items-center gap-2">
          {incidentCount === 0 ? (
            <>
              <span className="text-green-500 font-medium">Inga</span>
              <SecurityBadge level="verified" showLabel={false} />
            </>
          ) : (
            <span className="text-automotive-orange font-medium">{incidentCount}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-automotive-blue" />
          <span className="text-automotive-silver">Data säkerhetskopierad:</span>
        </div>
        <span className="text-white font-medium">{lastBackupTime}</span>
      </div>
    </div>
  );
}
