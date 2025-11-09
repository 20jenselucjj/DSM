import { memo } from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/IMG_1846 copy.jpg";
import backgroundImage from "@/assets/DSM_graphics_icons-09.png";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-[500px] lg:h-[600px] overflow-hidden">
      <div className="container mx-auto h-full relative">
        <div className="absolute left-0 top-0 w-full lg:w-[60%] h-full">
          <img
            src={heroImage}
            alt="Athletic trainer at sports event"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[55%] pointer-events-none">
          <div 
            className="absolute inset-0 opacity-75 will-change-transform"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'transform'
            }}
          />
          <div className="relative py-12 pl-16 lg:py-16 lg:pl-24 text-primary-foreground pointer-events-auto">
            <h1 className="text-middle text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.15] lg:leading-[1.15] xl:leading-[1.15] mb-8 tracking-title uppercase">
              QUALITY MEDICAL<br />
              COVERAGE AND<br />
              TRUSTED CARE<br />
              FOR ATHLETES,<br />
              TEAMS, AND<br />
              EVENTS
            </h1>
            <Button
              onClick={scrollToContact}
              variant="outline"
              size="default"
              className="border border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-2 rounded-full tracking-wider transition-all duration-300"
            >
              LEARN MORE HERE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
