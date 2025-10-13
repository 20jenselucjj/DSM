import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Desert Sports Med" className="h-12" />
          <div className="flex flex-col leading-none">
            <span className="text-primary font-semibold text-2xl tracking-[0.35em]">DESERT</span>
            <span className="text-[9px] font-semibold text-primary tracking-[0.35em]">SPORTS MED</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("home")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider relative group"
          >
            HOME
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => navigate("/about")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider relative group"
          >
            ABOUT
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider relative group"
          >
            SERVICES
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 tracking-wider relative group">
                PORTALS
                <ChevronDown className="h-3 w-3" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-190 shadow-md rounded-none z-50" align="start">
              <DropdownMenuItem className="px-2 py-1 text-[12px] leading-tight font-medium tracking-[0.25em] uppercase text-foreground border-b border-gray-190 data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">
                CLIENT PORTAL
              </DropdownMenuItem>
              <DropdownMenuItem className="px-2 py-1 text-[12px] leading-tight font-medium tracking-[0.25em] uppercase text-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">
                AT PORTAL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => scrollToSection("contact")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider relative group"
          >
            CONTACT US
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider relative group"
          >
            FAQ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </button>

          <div className="relative flex items-center">
            <Search className="h-3 w-3 text-muted-foreground mr-2 transform scaleX(-1)" />
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-3 py-1 text-xs border border-muted-foreground/30 rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring w-32"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
