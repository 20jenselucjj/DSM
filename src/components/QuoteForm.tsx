import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const QuoteForm = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [buttonText, setButtonText] = useState("CONTACT US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

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
          formType: 'quote',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setButtonText("TALK TO YOU SOON!");
        toast.success("Thank you for your request! We'll be in touch soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        
        // Reset button text after 3 seconds
        setTimeout(() => setButtonText("CONTACT US"), 3000);
      } else {
        setButtonText("CONTACT US");
        toast.error(result.error || "Failed to send request. Please try again.");
      }
    } catch (error) {
      setButtonText("CONTACT US");
      toast.error("Failed to send request. Please check your connection and try again.");
      console.error('Form submission error:', error);
    }
  };

  return (
    <>
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 text-secondary tracking-[0.08em] sm:tracking-[0.15em] lg:tracking-[0.2em] whitespace-nowrap">
        REQUEST A QUOTE
      </h2>
      <p className="text-center text-xs text-muted-foreground tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] mb-6 px-2" style={{ fontWeight: 600, color: "rgb(140, 56, 32)" }}>
        Get in touch with us to set up coverage
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div data-editor-id="div-FIRST-NAME-0" style={{ position: "relative" }}>
          <label htmlFor="firstName" className="block text-xs font-medium tracking-[0.2em] mb-2 text-foreground" data-editor-id="label-block-text-xs-0" style={{ position: "relative", letterSpacing: "2px", fontSize: "11px" }}>
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

        <div data-editor-id="div-LAST-NAME-1" style={{ position: "relative", transform: "translate(-1px, 0px)" }}>
          <label htmlFor="lastName" className="block text-xs font-medium tracking-[0.2em] mb-2 text-foreground">
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

        <div data-editor-id="div-EMAIL-2" style={{ position: "relative" }}>
          <label htmlFor="email" className="block text-xs font-medium tracking-[0.2em] mb-2 text-foreground">
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

        <div data-editor-id="div-HOW-CAN-WE-HELP-3" style={{ position: "relative", borderRadius: "0px" }}>
          <label htmlFor="message" className="block text-xs font-medium tracking-[0.2em] mb-2 text-foreground">
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
            className="rounded-full px-6 py-2 transition-colors tracking-widest text-xs bg-transparent hover:!bg-[#414759] hover:!text-white"
            data-editor-id="button-inline-flex-items-center-0"
            style={{ position: "relative", borderColor: "#414759", color: "#414759", borderWidth: "1px", borderStyle: "solid" }}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </>
  );
};

export default QuoteForm;
