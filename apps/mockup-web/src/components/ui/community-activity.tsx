
import { Users, MessageSquare, TrendingUp, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommunityActivityProps {
  newPosts: number;
  vehicleGroup: string;
  replies: number;
  trendingTopic: string;
  className?: string;
}

export function CommunityActivity({ newPosts, vehicleGroup, replies, trendingTopic, className }: CommunityActivityProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-automotive-blue" />
          <span className="text-automotive-silver">Nya inlägg i {vehicleGroup}-gruppen:</span>
        </div>
        <Badge className="bg-automotive-blue/20 text-automotive-blue">
          {newPosts}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-automotive-orange" />
          <span className="text-automotive-silver">Svar på dina frågor:</span>
        </div>
        <Badge className="bg-automotive-orange/20 text-automotive-orange">
          {replies}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-automotive-silver">Trending:</span>
        </div>
        <span className="text-white font-medium text-xs">{trendingTopic}</span>
      </div>
    </div>
  );
}
