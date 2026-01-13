import { useEffect, useState, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchInitialized, setIsSearchInitialized] = useState(false);

  // Initialize search query from sessionStorage only when needed
  useEffect(() => {
    if (!isSearchInitialized) {
      try {
        const saved = sessionStorage.getItem("header-search-query");
        if (saved) setSearchQuery(saved);
      } catch {
        // Ignore sessionStorage errors
      }
      setIsSearchInitialized(true);
    }
  }, [isSearchInitialized]);

  // Dispatch custom event when search query changes and persist to sessionStorage
  useEffect(() => {
    if (!isSearchInitialized) return;
    try {
      sessionStorage.setItem("header-search-query", searchQuery);
      const event = new CustomEvent("search-query-changed", {
        detail: { query: searchQuery },
      });
      window.dispatchEvent(event);
    } catch {
      // Ignore sessionStorage errors
    }
  }, [searchQuery, isSearchInitialized]);

  const scrollToSection = useCallback((id: string) => {
    // FAQ is on the about page
    if (id === "faq") {
      if (location.pathname !== "/about") {
        navigate("/about", { state: { scrollTo: id } });
        return;
      }
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    
    // Other sections are on the home page
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [location.pathname, navigate]);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 transform-gpu">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer lg:ml-6"
          onClick={() => navigate("/")}
          role="link"
          aria-label="Go to home page"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/");
          }}
        >
          <OptimizedImage 
            src={new URL('@/assets/DSM_BurntSienna-03.webp', import.meta.url).href}
            alt="Desert Sports Med" 
            className="h-14 lg:h-16" 
            priority={true}
          />
        </div>

        <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
          <button
            onClick={() => scrollToSection("home")}
            className="text-xs font-medium text-muted-foreground transition-colors relative group"
            style={{ letterSpacing: '0.3em' }}
          >
            HOME
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a35f44] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
          <button
            onClick={() => navigate("/about")}
            className="text-xs font-medium text-muted-foreground transition-colors relative group"
            style={{ letterSpacing: '0.3em' }}
          >
            ABOUT
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a35f44] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
          <button
            onClick={() => navigate("/services")}
            className="text-xs font-medium text-muted-foreground transition-colors relative group"
            style={{ letterSpacing: '0.3em' }}
          >
            SERVICES
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a35f44] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="text-xs font-medium text-muted-foreground transition-colors relative group"
            style={{ letterSpacing: '0.3em' }}
          >
            CONTACT US
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a35f44] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-xs font-medium text-muted-foreground transition-colors relative group"
            style={{ letterSpacing: '0.3em' }}
          >
            FAQ
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a35f44] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </button>

          <div className="relative flex items-center ml-2">
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
                <ul className="space-y-4">
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("home")}
                        className="w-full text-sm font-medium px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        style={{ letterSpacing: '0.3em' }}
                      >
                        HOME
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => navigate("/about")}
                        className="w-full text-sm font-medium px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        style={{ letterSpacing: '0.3em' }}
                      >
                        ABOUT
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => navigate("/services")}
                        className="w-full text-sm font-medium px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        style={{ letterSpacing: '0.3em' }}
                      >
                        SERVICES
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("contact")}
                        className="w-full text-sm font-medium px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        style={{ letterSpacing: '0.3em' }}
                      >
                        CONTACT US
                      </button>
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <button
                        onClick={() => scrollToSection("faq")}
                        className="w-full text-sm font-medium px-4 py-3 rounded hover:text-primary hover:underline hover:decoration-primary focus:text-primary focus:underline focus:decoration-primary decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        style={{ letterSpacing: '0.3em' }}
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

export default memo(Header);
