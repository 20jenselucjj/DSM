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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-12 text-secondary tracking-[0.25em]">
          WHAT OUR CLIENTS SAY
        </h2>

        <div className="max-w-4xl mx-auto relative">
          <div className="flex items-center justify-between gap-8">
            <button
              aria-label="Previous testimonial"
              onClick={goToPrevious}
              className="p-2 text-muted-foreground transition-transform hover:-translate-x-1"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            <div className="text-center px-4">
              <p className="text-base md:text-lg text-foreground/80 leading-loose mb-8 italic tracking-wide">
                "{testimonials[currentIndex].quote}"
              </p>
              <p className="text-xs font-medium text-muted-foreground italic">
                -{testimonials[currentIndex].author}
              </p>
            </div>

            <button
              aria-label="Next testimonial"
              onClick={goToNext}
              className="p-2 text-muted-foreground transition-transform hover:translate-x-1"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
