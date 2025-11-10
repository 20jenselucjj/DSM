import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { animations } from "@/lib/animations";

interface PortalLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showHero?: boolean;
  heroHeight?: "sm" | "md" | "lg";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const PortalLayout = ({ 
  children, 
  title, 
  description, 
  showHero = true,
  heroHeight = "md",
  maxWidth = "lg"
}: PortalLayoutProps) => {
  const heroHeightClasses = {
    sm: "h-[200px] sm:h-[250px]",
    md: "h-[200px] sm:h-[280px]",
    lg: "h-[280px] sm:h-[380px] lg:h-[460px]"
  };

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl", 
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full"
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Page Header Section */}
        <section className="bg-background">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <div className={animations.slideInFromTop}>
              <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-[0.25em] text-secondary">
                {title}
              </h1>
              <p className="mt-3 text-center text-sm sm:text-base text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          {showHero && (
            <div className={`${heroHeightClasses[heroHeight]} ${animations.fadeIn}`}>
              <OptimizedImage 
                src={new URL('@/assets/ATportal_header.jpg', import.meta.url).href}
                alt="Athletic trainers on assignment" 
                className="h-full w-full object-cover"
                priority={true}
              />
            </div>
          )}
        </section>

        {/* Content Section */}
        <section className="bg-background">
          <div className={`container mx-auto px-6 py-10 ${maxWidthClasses[maxWidth]}`}>
            <div className={animations.slideInFromBottom}>
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PortalLayout;