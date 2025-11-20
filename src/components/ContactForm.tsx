import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [buttonText, setButtonText] = useState("CONTACT US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonText("SENDING...");

    try {
      const response = await fetch(import.meta.env.VITE_FORM_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          formType: 'contact',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setButtonText("TALK TO YOU SOON!");
        toast.success("Thank you for reaching out! We'll be in touch soon.");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        
        // Reset button text after 3 seconds
        setTimeout(() => setButtonText("CONTACT US"), 3000);
      } else {
        setButtonText("CONTACT US");
        toast.error(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setButtonText("CONTACT US");
      toast.error("Failed to send message. Please check your connection and try again.");
      console.error('Form submission error:', error);
    }
  };

  return (
    <section id="contact" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-card p-8 lg:p-12 shadow-lg">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-2 text-secondary tracking-wide" style={{ position: "relative", letterSpacing: "6px" }}>
            CONTACT US
          </h2>
          <p className="text-center text-xs text-muted-foreground mb-6">
            Get in touch with us to set up coverage
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-xs font-medium mb-2 text-foreground">
                FIRST NAME
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-medium mb-2 text-foreground">
                LAST NAME
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-2 text-foreground">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium mb-2 text-foreground">
                HOW CAN WE HELP?
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className={
                  // Match About page button styling regardless of text state
                  "rounded-full border border-primary px-6 py-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors tracking-widest text-xs bg-transparent"
                }
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
