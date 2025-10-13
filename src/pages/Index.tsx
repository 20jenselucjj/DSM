import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const id = state.scrollTo;
      // slight delay to ensure sections rendered
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhySection />
        <div className="mt-10 h-[3px] bg-primary w-64 mx-auto" />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
