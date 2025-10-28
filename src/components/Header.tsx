import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { account, getCurrentUserCached, clearUserCache } from "@/lib/appwrite";
import logo from "@/assets/logo.png";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState(
    sessionStorage.getItem("header-search-query") || "",
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any | null>(null);

  // Dispatch custom event when search query changes and persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("header-search-query", searchQuery);
    const event = new CustomEvent("search-query-changed", {
      detail: { query: searchQuery },
    });
    window.dispatchEvent(event);
  }, [searchQuery]);

  // Throttle account.get calls to avoid rate limits
  const COOLDOWN_MS = 30000;
  const lastFetchRef = useRef<number>(0);
  const inFlightRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let ignore = false;

    const refreshUser = async (force = false) => {
      if (!force && Date.now() - lastFetchRef.current < COOLDOWN_MS) return;
      if (inFlightRef.current) return;
      const p = (async () => {
        try {
          const u = await getCurrentUserCached(force);
          if (!ignore) setUser(u);
        } catch (_) {
          if (!ignore) setUser(null);
        } finally {
          lastFetchRef.current = Date.now();
          inFlightRef.current = null;
        }
      })();
      inFlightRef.current = p;
      await p;
    };

    // Initial check and on route changes
    void refreshUser(true);

    // Refresh when tab/window regains focus or becomes visible
    const handleFocus = () => void refreshUser(false);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refreshUser(false);
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // Listen for app-wide session changes (login/logout)
    const handleSessionChanged = () => {
      clearUserCache();
      void refreshUser(true);
    };
    window.addEventListener(
      "appwrite-session-changed",
      handleSessionChanged as EventListener,
    );

    return () => {
      ignore = true;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener(
        "appwrite-session-changed",
        handleSessionChanged as EventListener,
      );
    };
    // Re-check on route changes so header stays in sync with auth state
  }, [location.pathname]);

  const initials = (nameOrEmail: string | undefined) => {
    if (!nameOrEmail) return "";
    const parts = String(nameOrEmail).split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return String(nameOrEmail)[0]?.toUpperCase() || "";
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession("current");
    } catch (_) {
      // Ignore errors when deleting session
    }
    try {
      window.dispatchEvent(new Event("appwrite-session-changed"));
    } catch {
      // Ignore errors when dispatching event
    }
    setUser(null);
    navigate("/trainer/login");
  };

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
      <div className="container mx-auto px-4 py-8 flex items-center justify-between">
        <div
          className="flex items-center gap-1 cursor-pointer ml-6 mt-1"
          onClick={() => navigate("/")}
          role="link"
          aria-label="Go to home page"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/");
          }}
        >
          <img src={logo} alt="Desert Sports Med" className="h-14" />
          <div className="flex flex-col leading-none">
            <span className="text-primary font-semibold text-[30px] tracking-[0.35em] ml-[-2px]">
              DESERT
            </span>
            <span className="text-[10px] font-semibold text-primary tracking-[0.4em] mt-1">
              SPORTS MED
            </span>
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
              <button className="text-xs font-medium text-muted-foreground hover:text-primary data-[state=open]:text-primary transition-colors flex items-center gap-1 tracking-wider relative group">
                PORTALS
                <ChevronDown className="h-3 w-3" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full data-[state=open]:w-full"></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-background rounded-none z-50 p-0"
              align="start"
              alignOffset={3}
            >
              <DropdownMenuItem className="px-1 py-1 text-[11px] leading-tight font-medium tracking-[0.25em] uppercase text-foreground border-b border-border data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground">
                CLIENT PORTAL
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/at-portal")}
                className="px-1 py-1 text-[11px] leading-tight font-medium tracking-[0.25em] uppercase text-foreground data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"
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

          {/* Profile menu (visible when signed in) */}
          {user && (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Open account menu"
                    className="inline-flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs font-medium">
                        {initials(user.name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground">
                      {user.name || user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background rounded-none z-50 p-1 min-w-[240px]"
                >
                  <DropdownMenuLabel className="text-[11px] tracking-wider uppercase text-muted-foreground">
                    Account
                  </DropdownMenuLabel>
                  <div className="px-2 py-1.5">
                    <div className="text-xs font-semibold text-foreground">
                      {user.name || user.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="px-2 py-2 text-[12px] tracking-wide text-destructive"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
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
                          <span className="block w-full text-center">
                            PORTALS
                          </span>
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
                            {user && (
                              <div className="mt-2 border-t border-border pt-2">
                                <div className="px-4 py-2 text-xs text-muted-foreground">
                                  Signed in as
                                  <div className="text-foreground font-medium">
                                    {user.name || user.email}
                                  </div>
                                  <div>{user.email}</div>
                                </div>
                                <SheetClose asChild>
                                  <Button
                                    onClick={handleSignOut}
                                    variant="outline"
                                    className="w-full"
                                  >
                                    Sign Out
                                  </Button>
                                </SheetClose>
                              </div>
                            )}
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
