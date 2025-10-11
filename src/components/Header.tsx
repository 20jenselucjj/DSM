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
            <span className="text-primary font-bold text-lg leading-tight tracking-widest">
              DESERT
            </span>
            <span className="text-xs text-primary tracking-widest">
              SPORTS MED
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("home")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider"
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider"
          >
            SERVICES
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 tracking-wider">
                PORTALS
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border z-50">
              <DropdownMenuItem className="p-0">
                <Button variant="default" className="w-full justify-center text-xs" size="sm">
                  CLIENT PORTAL
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2">
                <span className="text-xs text-foreground w-full text-center">
                  AT PORTAL
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => scrollToSection("contact")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider"
          >
            CONTACT US
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider"
          >
            FAQ
          </button>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1 text-xs border border-muted-foreground/30 rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring w-32"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
