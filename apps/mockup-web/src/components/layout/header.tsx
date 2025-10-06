
import { Shield, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-automotive-darker border-b border-automotive-blue/20 security-indicator">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden text-automotive-blue hover:bg-automotive-blue/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="gauge-border w-10 h-10">
              <div className="gauge-inner flex items-center justify-center">
                <Shield className="w-5 h-5 text-automotive-blue" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CaiZen</h1>
              <p className="text-xs text-automotive-silver">Din kompletta fordonsplattform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center text-xs text-automotive-silver">
              <Shield className="w-3 h-3 text-green-500 mr-1" />
              <span>Skyddad</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-automotive-blue hover:bg-automotive-blue/10"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-automotive-darker border-automotive-blue/20 z-50"
            >
              <DropdownMenuItem className="text-automotive-silver hover:bg-automotive-blue/10">
                Min Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-automotive-silver hover:bg-automotive-blue/10">
                Datasäkerhet
              </DropdownMenuItem>
              <DropdownMenuItem className="text-automotive-silver hover:bg-automotive-blue/10">
                Om CaiZen
              </DropdownMenuItem>
              <DropdownMenuItem className="text-automotive-orange hover:bg-automotive-orange/10">
                Logga ut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
