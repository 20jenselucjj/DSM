import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";

const ResourceLibrary = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="bg-background">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-[0.25em] text-secondary">RESOURCE LIBRARY</h1>
            <p className="mt-3 text-center text-sm sm:text-base text-muted-foreground">Access forms, templates, and best practices.</p>
          </div>
          <img src={heroImage} alt="Desert landscape" className="h-[200px] w-full object-cover sm:h-[280px]" />
        </section>
        <section className="bg-background">
          <div className="container mx-auto px-6 py-10 max-w-3xl">
            <p className="text-center text-muted-foreground">Coming soon. Browse resources and documentation here.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourceLibrary;