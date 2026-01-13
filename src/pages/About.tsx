import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate, useLocation } from "react-router-dom";
import { memo, useEffect } from "react";

const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-[0.25em] text-primary">ABOUT US</h1>
          </div>
          <OptimizedImage
            src={new URL('@/assets/sc_dsm.webp', import.meta.url).href}
            alt="Desert landscape"
            className="h-[260px] w-full object-cover sm:h-[340px]"
            priority={true}
          />
        </section>

        {/* Mission blurb */}
        <section className="bg-background">
          <div className="container mx-auto px-6 py-10 max-w-4xl">
            <p className="text-sm sm:text-base leading-relaxed text-foreground/80 text-center">
              At Desert Sports Med, we are dedicated to providing professional, on-site medical coverage for athletes,
              teams, and sporting events of all levels. Our certified athletic trainers bring years of experience in
              sports medicine, specializing in injury prevention, immediate care, and safe return-to-play decisions. We
              partner with leagues, schools, and organizations to ensure every athlete receives quality medical
              attention before, during, and after competition. Our mission is to protect and support athletes so they
              can perform at their best with confidence. Whether it's game day or tournament weekend, Desert Sports Med
              is your trusted partner in athlete health and safety.
            </p>
          </div>
        </section>

        {/* Founders */}
        <section className="bg-primary text-primary-foreground border-y border-background/60">
          <div className="container mx-auto px-6 py-16 max-w-3xl">
            {/* Tyler */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-20">
              <div className="flex-shrink-0">
                <div className="h-[250px] w-[250px] rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center">
                  <div className="h-[220px] w-[220px] rounded-full bg-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 text-left max-w-xl ml-auto">
                <h3 className="text-xl tracking-[0.3em] font-semibold mb-2">TYLER GILL | LAT, ATC</h3>
                <div className="flex items-center justify-start mb-6">
                  <div className="w-16 h-px bg-accent mr-3"></div>
                  <p className="text-[11px] uppercase tracking-[0.25em] opacity-80">CREATOR & OWNER OF DSM</p>
                </div>
                <p className="text-sm leading-loose opacity-95 tracking-wide">
                  "Having a certified athletic trainer from Desert Sports Med on our sidelines has been invaluable. When
                  one of our players suffered a potential concussion, their quick assessment and proper protocols
                  ensured the player's safety. Their expertise has been crucial for our team's success."
                </p>
              </div>
            </div>

            {/* Nick */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="flex-shrink-0">
                <div className="h-[250px] w-[250px] rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center">
                  <div className="h-[220px] w-[220px] rounded-full bg-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 text-left max-w-xl mr-auto md:text-right">
                <h3 className="text-lg md:text-xl tracking-[0.25em] font-semibold mb-2">NICK JENSEN | MAT, LAT, ATC</h3>
                <div className="flex items-center justify-start md:justify-end mb-6">
                  <p className="text-[11px] uppercase tracking-[0.25em] opacity-80">CO-OWNER</p>
                  <div className="w-16 h-px bg-accent ml-3"></div>
                </div>
                <p className="text-sm opacity-95 tracking-wide leading-loose">
                  "Having a certified athletic trainer from Desert Sports Med on our sidelines has been invaluable. When
                  one of our players suffered a potential concussion, their quick assessment and proper protocols
                  ensured the player's safety. Their expertise has been crucial for our team's success."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-background">
          <div className="container mx-auto px-6 py-16 max-w-3xl">
            <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-secondary">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="mt-8 border-t border-primary/50">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-primary/50">
                  <AccordionTrigger className="text-left text-sm tracking-wider">What services do you provide?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-loose tracking-wide">
                      "Having a certified athletic trainer from Desert Sports Med on our sidelines has been invaluable.
                      When one of our players suffered a potential concussion, their quick assessment and proper
                      protocols ensured the player's safety. Their expertise has been crucial for our team's success."
                    </p>
                  </AccordionContent>
                </AccordionItem>
                {[2, 3, 4, 5, 6].map((i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-primary/50">
                    <AccordionTrigger className="text-left text-sm tracking-wider">What services do you provide?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">Details coming soon.</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => navigate("/", { state: { scrollTo: "contact" } })}
                className="rounded-full border border-primary px-6 py-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors tracking-widest text-xs"
              >
                CONTACT US
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default memo(About);