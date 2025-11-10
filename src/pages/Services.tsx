import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import QuoteForm from "@/components/QuoteForm";
import OptimizedImage from "@/components/OptimizedImage";

interface Service {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

const services: Service[] = [
  {
    id: 'injured-athlete',
    image: new URL('@/assets/1.jpg', import.meta.url).href,
    title: 'INJURED ATHLETE',
    subtitle: 'CARE ON & OFF FIELD'
  },
  {
    id: 'sideline-medical',
    image: new URL('@/assets/2.jpg', import.meta.url).href,
    title: 'SIDELINE MEDICAL',
    subtitle: 'COVERAGE'
  },
  {
    id: 'sports-medicine',
    image: new URL('@/assets/4.jpg', import.meta.url).href,
    title: 'SPORTS MEDICINE',
    subtitle: '& MANUAL THERAPY'
  }
];

const Services = () => {
  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote-section');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="bg-background relative" data-editor-id="section-bg-background-1" style={{ position: "relative", transform: "translate(-4px, 1px)" }}>
            <div className="container mx-auto px-6 pt-8 pb-4">
              <h1 className="text-center text-3xl sm:text-5xl font-bold tracking-[0.2em] text-secondary" data-editor-id="h1-text-center-text-3xl-0" style={{ position: "relative", color: "rgb(65, 71, 89)" }}>
                SERVICES
              </h1>
            </div>
            <div className="relative" data-editor-id="div-relative-1" style={{}}>
              <OptimizedImage
                src={new URL('@/assets/services_web.jpg', import.meta.url).href}
                alt="Sports field"
                className="h-[260px] w-full object-cover sm:h-[340px]"
                priority={true}
              />
              {/* Request Quote Button Overlay */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2" style={{ zIndex: 9999, pointerEvents: "auto" }}>
                <button 
                  onClick={scrollToQuote}
                  className="rounded-full bg-accent text-accent-foreground px-8 py-2 text-xs tracking-[0.2em] hover:opacity-90 transition-opacity shadow-lg cursor-pointer" 
                  data-editor-id="button-rounded-full-bg-accent-0" 
                  style={{ position: "relative", backgroundColor: "rgb(163, 95, 68)", zIndex: 9999, pointerEvents: "auto" }}
                >
                  REQUEST QUOTE
                </button>
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="bg-background" style={{ paddingTop: "60px" }}>
            <div className="container mx-auto px-6 pb-16 max-w-4xl" data-editor-id="div-container-mx-auto-0" style={{ position: "relative", transform: "translate(-4px, 1px)", fontSize: "15px", width: "896px", height: "775px" }}>
              {/* Main Heading */}
              <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-[0.2em] text-secondary mb-8" data-editor-id="h2-text-center-text-2xl-0" style={{ position: "relative", fontSize: "clamp(20px, 5vw, 28px)" }}>
                SPORTS MEDICINE CARE FOR TOURNAMENTS, CLUBS, TEAMS, & MORE
              </h2>
              
              {/* Description Text */}
              <p className="text-xs sm:text-sm leading-relaxed text-foreground tracking-[0.2em] text-center mb-12 max-w-3xl mx-auto" data-editor-id="p-text-xs-sm-text-sm-1" style={{ position: "relative", color: "rgb(46, 35, 29)", fontWeight: 600, fontSize: "15px", textAlign: "justify", letterSpacing: "1.5px" }}>
                At Desert Sports Med, we are dedicated to providing professional, on-site medical coverage for athletes, teams, and sporting events of all levels. Our certified athletic trainers bring years of experience in sports medicine, specializing in injury prevention, immediate care, and safe return-to-play decisions. We partner with leagues, schools, and organizations to ensure every athlete receives quality medical attention before, during, and after competition. Our mission is to protect and support athletes so they can perform at their best with confidence. Whether it's game day or tournament weekend, Desert Sports Med is your trusted partner in athlete health and safety.
              </p>
              
              {/* Service Cards */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-9 md:gap-9">
                {services.map(service => (
                  <ServiceCard 
                    key={service.id}
                    image={service.image}
                    title={service.title}
                    subtitle={service.subtitle}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section id="quote-section" className="relative bg-background pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="relative min-h-[600px] lg:min-h-[700px]">
                {/* Background Image - Full Width */}
                <div className="absolute inset-0 w-full h-full">
                  <OptimizedImage
                    src={new URL('@/assets/IMG_1846 copy.jpg', import.meta.url).href}
                    alt="Athletic trainer"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Form Card - Overlapping on the right */}
                <div className="relative z-10 flex items-center justify-center lg:justify-end min-h-[600px] lg:min-h-[700px] py-8 lg:py-12" data-editor-id="div-relative-z-10-1" style={{}}>
                  <div className="bg-card p-8 lg:p-12 shadow-2xl max-w-md w-full lg:max-w-lg lg:mr-8" data-editor-id="div-bg-card-p-8-0" style={{ position: "relative", width: "512px", height: "692px" }}>
                    <QuoteForm />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
  );
};

export default Services;
