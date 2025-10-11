import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Desert Sports Med" className="h-12" />
          <div className="flex flex-col">
            <span className="text-secondary font-bold text-lg leading-tight tracking-wide">
              DESERT
            </span>
            <span className="text-xs text-muted-foreground tracking-widest">
              SPORTS MED
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("home")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            SERVICES
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                PORTALS
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border">
              <DropdownMenuItem>
                <Button variant="default" className="w-full justify-start" size="sm">
                  CLIENT PORTAL
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="text-sm w-full text-left px-2 py-1">
                  AT PORTAL
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            CONTACT US
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            FAQ
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring w-40"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
