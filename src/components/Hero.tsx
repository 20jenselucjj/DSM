import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-[500px] lg:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Athletic trainer at sports event"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[55%] bg-primary/95 p-12 lg:p-16 text-primary-foreground">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-8 tracking-wide">
          QUALITY MEDICAL COVERAGE AND TRUSTED CARE FOR ATHLETES, TEAMS, AND EVENTS
        </h1>
        <Button
          onClick={scrollToContact}
          variant="outline"
          size="lg"
          className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-medium tracking-wide"
        >
          LEARN MORE HERE
        </Button>
      </div>
    </section>
  );
};

export default Hero;
