import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "Having a certified athletic trainer from Desert Sports Med on our sidelines has been invaluable. When one of our players suffered a potential concussion, their quick assessment and proper protocols ensured the player's safety. Their expertise has been crucial for our team's success.",
    author: "St. George Pro Soccer Team",
  },
  {
    quote:
      "Desert Sports Med has provided exceptional care for our youth league. Their trainers are professional, knowledgeable, and always prepared. Parents feel confident knowing qualified medical professionals are on site during games.",
    author: "Desert Youth Sports League",
  },
  {
    quote:
      "We've partnered with Desert Sports Med for our tournament events, and their service is outstanding. They handle everything from pre-event planning to on-site medical coverage with professionalism and expertise.",
    author: "Regional Athletic Association",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-secondary tracking-wide">
          WHAT OUR CLIENTS SAY
        </h2>

        <div className="max-w-4xl mx-auto relative">
          <div className="flex items-center justify-between gap-8">
            <Button
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
              className="shrink-0 h-12 w-12 text-secondary hover:text-primary"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <div className="text-center px-4">
              <p className="text-base lg:text-lg text-foreground leading-relaxed mb-6 italic">
                "{testimonials[currentIndex].quote}"
              </p>
              <p className="text-sm font-medium text-muted-foreground italic">
                -{testimonials[currentIndex].author}
              </p>
            </div>

            <Button
              onClick={goToNext}
              variant="ghost"
              size="icon"
              className="shrink-0 h-12 w-12 text-secondary hover:text-primary"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
