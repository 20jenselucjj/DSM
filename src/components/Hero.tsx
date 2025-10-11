import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[500px] flex items-center overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-[400px] lg:h-[500px]">
            <img
              src={heroImage}
              alt="Athletic trainer at sports event"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-primary p-12 lg:p-16 text-primary-foreground">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
