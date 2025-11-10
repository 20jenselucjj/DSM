import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserCached } from "@/lib/appwrite";
import ATPortalGate from "@/components/ATPortalGate";
import { CalendarDays, ClipboardList, Clock, Phone } from "lucide-react";

const linkItems = [
  {
    title: "Event Schedule",
    description: "View upcoming assignments and event details.",
    icon: CalendarDays,
    to: "/event-schedule",
  },
  {
    title: "Coverage Report",
    description: "Submit post-event coverage and notes.",
    icon: ClipboardList,
    to: "/coverage-report",
  },
  {
    title: "Timesheet Submission",
    description: "Log hours for completed assignments.",
    icon: Clock,
    to: "/timesheet",
  },
  {
    title: "Contact Coordinator",
    description: "Reach DSM coordinator for support and scheduling.",
    icon: Phone,
    to: "/contact-coordinator",
  },
];

const ATPortal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Require authenticated trainer account to access portal
  useEffect(() => {
    let ignore = false;
    getCurrentUserCached(true)
      .then((user) => {
        if (ignore) return;
        if (!user?.emailVerification) {
          navigate("/verify-email", { replace: true });
        }
      })
      .catch(() => {
        if (ignore) return;
        navigate("/trainer/login", { replace: true });
      });
    return () => {
      ignore = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <ATPortalGate />

        {/* Hero with branded overlay and CTAs */}
        <section className="relative h-[280px] sm:h-[380px] lg:h-[460px]">
          <OptimizedImage
            src={new URL('@/assets/ATportal_header.jpg', import.meta.url).href}
            alt="Athletic trainers on assignment"
            className="absolute inset-0 h-full w-full object-cover"
            priority={true}
          />
          {/* Brand overlay for cohesion with home page */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-secondary/40 mix-blend-multiply" />
          {/* Content */}
          <div className="relative h-full">
            <div className="container mx-auto h-full px-6 flex items-center justify-center">
              <div className="max-w-3xl text-center text-white motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.25em] uppercase drop-shadow-lg">
                  AT PORTAL
                </h1>
                <p className="mt-3 text-sm sm:text-base opacity-95 drop-shadow-md">
                  Tools and resources for Athletic Trainers on assignment.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild variant="secondary" className="rounded-full bg-background text-foreground border-2 border-background hover:bg-primary hover:text-primary-foreground hover:border-primary tracking-widest font-semibold">
                    <Link to="/event-schedule" aria-label="Open Event Schedule">VIEW SCHEDULE</Link>
                  </Button>
                  <Button asChild variant="secondary" className="rounded-full bg-accent text-accent-foreground border-2 border-accent hover:bg-secondary hover:text-secondary-foreground hover:border-secondary tracking-widest font-semibold">
                    <Link to="/coverage-report" aria-label="Open Coverage Report">REPORT COVERAGE</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Grid with modern, responsive styling */}
        <section className="bg-background">
          <div className="container mx-auto px-6 py-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {linkItems.map(({ title, description, icon: Icon, to }, idx) => {
                // Handle click action for the entire card
                const handleCardClick = () => {
                  if (to) {
                    navigate(to);
                  } else if (scrollTo) {
                    navigate("/", { state: { scrollTo } });
                  } else {
                    toast({ title: "Coming soon", description: `${title} will be available shortly.` });
                  }
                };

                // Handle keyboard navigation
                const handleKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                  }
                };

                return (
                  <Card
                    key={title}
                    className="group border-border bg-card transition-all motion-safe:duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl hover:shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-card/80"
                    style={{ animationDelay: `${idx * 60}ms` }}
                    onClick={handleCardClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ${title} - ${description}`}
                  >
                    <CardHeader className="flex-row items-center gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom motion-safe:duration-500 pb-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border-2 text-white font-semibold transition-all group-hover:scale-110 ${
                        idx % 4 === 0 ? 'bg-primary border-primary group-hover:bg-primary/90' :
                        idx % 4 === 1 ? 'bg-secondary border-secondary group-hover:bg-secondary/90' :
                        idx % 4 === 2 ? 'bg-accent border-accent group-hover:bg-accent/90' :
                        'bg-muted-foreground border-muted-foreground group-hover:bg-muted-foreground/90'
                      }`}>
                        <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg tracking-wide text-foreground font-semibold group-hover:text-primary transition-colors">
                          {title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-[13px] sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                          {description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <div className={`inline-flex items-center text-sm font-medium tracking-wide transition-all ${
                        idx % 4 === 0 ? 'text-primary group-hover:text-primary/80' :
                        idx % 4 === 1 ? 'text-secondary group-hover:text-secondary/80' :
                        idx % 4 === 2 ? 'text-accent group-hover:text-accent/80' :
                        'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        Click to open →
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ATPortal;