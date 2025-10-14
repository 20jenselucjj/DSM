import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
          role="link"
          aria-label="Go to home page"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/");
          }}
        >
          <img src={logo} alt="Desert Sports Med" className="h-12" />
          <div className="flex flex-col leading-none">
            <span className="text-primary font-semibold text-2xl tracking-[0.35em]">DESERT</span>
            <span className="text-[9px] font-semibold text-primary tracking-[0.35em]">SPORTS MED</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
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
            <DropdownMenuContent className="bg-background border border-border shadow-md rounded-none z-50" align="start">
              <DropdownMenuItem className="px-2 py-1 text-[12px] leading-tight font-medium tracking-[0.25em] uppercase text-foreground border-b border-border data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">
                CLIENT PORTAL
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/at-portal")}
                className="px-2 py-1 text-[12px] leading-tight font-medium tracking-[0.25em] uppercase text-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
              >
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

        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-muted-foreground/30 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4 [&>button]:hidden">
              <nav aria-label="Mobile">
                <ul className="space-y-1">
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("home")}
                        className="w-full text-sm font-medium tracking-wider px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        HOME
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => navigate("/about")}
                        className="w-full text-sm font-medium tracking-wider px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        ABOUT
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("services")}
                        className="w-full text-sm font-medium tracking-wider px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        SERVICES
                      </button>
                    </SheetClose>
                  </li>

                  <li className="pt-2 mt-2 border-t border-border">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="portals">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium tracking-wider text-foreground hover:text-primary hover:decoration-primary focus:text-primary focus:decoration-primary decoration-2 underline-offset-4">
                          <span className="block w-full text-center">PORTALS</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1">
                            <SheetClose asChild>
                              <button className="w-full text-sm px-4 py-3 rounded hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
                                CLIENT PORTAL
                              </button>
                            </SheetClose>
                            <SheetClose asChild>
                              <button
                                onClick={() => navigate("/at-portal")}
                                className="w-full text-sm px-4 py-3 rounded hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                              >
                                AT PORTAL
                              </button>
                            </SheetClose>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>

                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("contact")}
                        className="w-full text-sm font-medium tracking-wider px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        CONTACT US
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("faq")}
                        className="w-full text-sm font-medium tracking-wider px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        FAQ
                      </button>
                    </SheetClose>
                  </li>
                </ul>

                <div className="mt-4 flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground transform scaleX(-1)" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-muted-foreground/30 rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
