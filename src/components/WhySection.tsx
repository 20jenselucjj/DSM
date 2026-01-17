import { memo } from "react";
import OptimizedImage from "@/components/OptimizedImage";

const WhySection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-secondary tracking-[0.4em] relative">
          WHY DESERT SPORTS MED
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center relative">
            <div className="mb-6 h-32 flex items-center justify-center">
              <OptimizedImage src={new URL('@/assets/Certified.webp', import.meta.url).href} alt="Professional certification" className="h-24 w-auto" />
            </div>
            <h3 className="text-lg font-bold mb-4 text-secondary tracking-wide relative">
              PROFESSIONAL AND CERTIFIED EXPERTISE
            </h3>
            <p className="text-sm text-foreground leading-relaxed relative tracking-[0.1em]">
              Our team consists of highly trained and certified athletic trainers with extensive
              experience in sports medicine. We provide immediate, on-site injury evaluation and
              immediate care—ensuring athletes receive professional medical attention without delay.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-6 h-32 flex items-center justify-center">
              <OptimizedImage src={new URL('@/assets/handshake.webp', import.meta.url).href} alt="Comprehensive coverage" className="h-24 w-auto" />
            </div>
            <h3 className="text-lg font-bold mb-4 text-secondary tracking-wide">
              COMPREHENSIVE COVERAGE YOU CAN TRUST
            </h3>
            <p className="text-sm text-foreground leading-relaxed tracking-[0.1em] relative">
              From youth leagues to competitive tournaments, Desert Sports Med provides reliable
              medical coverage for teams, leagues, and events of all sizes—working directly with
              organizations to deliver seamless coverage before, during, and after competition.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-6 h-32 flex items-center justify-center">
              <OptimizedImage src={new URL('@/assets/Heartbeat.webp', import.meta.url).href} alt="Athlete health and safety" className="h-24 w-auto" />
            </div>
            <h3 className="text-lg font-bold mb-4 text-secondary tracking-wide">
              DEDICATED TO ATHLETE HEALTH AND SAFETY
            </h3>
            <p className="text-sm text-foreground leading-relaxed tracking-[0.1em] relative">
              We're passionate about keeping athletes healthy, safe, and performing at their best.
              Our mission is to provide quality care that allows athletes, parents, and leagues can
              focus on the game, knowing their health is in expert hands.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default memo(WhySection);
