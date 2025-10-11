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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for reaching out! We'll be in touch soon.");
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-card p-8 lg:p-12 rounded-sm shadow-lg">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-2 text-secondary tracking-wide">
            CONTACT US
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
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
                className="w-full px-4 py-2 border border-input rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full px-4 py-2 border border-input rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full px-4 py-2 border border-input rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full px-4 py-2 border border-input rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium tracking-wide px-8 py-6 rounded-full text-sm"
              >
                TALK TO YOU SOON!
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
