
import { Shield, Lock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityBadgeProps {
  level: "encrypted" | "masked" | "verified";
  className?: string;
  showLabel?: boolean;
}

export function SecurityBadge({ level, className, showLabel = true }: SecurityBadgeProps) {
  const configs = {
    encrypted: {
      icon: Lock,
      label: "Krypterad",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    masked: {
      icon: Eye,
      label: "Maskerad",
      color: "text-automotive-blue",
      bgColor: "bg-automotive-blue/10"
    },
    verified: {
      icon: Shield,
      label: "Verifierad",
      color: "text-automotive-orange",
      bgColor: "bg-automotive-orange/10"
    }
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
      config.bgColor,
      config.color,
      className
    )}>
      <Icon className="w-3 h-3 animate-security-pulse" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
