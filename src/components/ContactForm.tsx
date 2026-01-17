import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [buttonText, setButtonText] = useState("CONTACT US");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setButtonText("SENDING...");

    try {
      const response = await fetch(import.meta.env.VITE_FORM_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          formType: 'contact',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setButtonText("TALK TO YOU SOON!");
        toast.success("Thank you for reaching out! We'll be in touch soon.");
        form.reset();
        
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium mb-2 text-foreground">FIRST NAME</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="given-name"
                        className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium mb-2 text-foreground">LAST NAME</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="family-name"
                        className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium mb-2 text-foreground">EMAIL</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium mb-2 text-foreground">HOW CAN WE HELP?</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        className="w-full px-4 py-2 border border-secondary/40 rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-center">
                <Button
                  type="submit"
                  className={
                    // Match About page button styling regardless of text state
                    "rounded-full border border-primary px-6 py-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors tracking-widest text-xs bg-transparent"
                  }
                  disabled={buttonText !== "CONTACT US"}
                >
                  {buttonText}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
