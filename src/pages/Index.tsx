import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhySection />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
