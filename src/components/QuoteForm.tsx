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

const QuoteForm = () => {
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
          formType: 'quote',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setButtonText("TALK TO YOU SOON!");
        toast.success("Thank you for your request! We'll be in touch soon.");
        form.reset();
        
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
      <p className="text-center text-xs text-muted-foreground tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] mb-6 px-2 font-semibold text-[#8c3820]">
        Get in touch with us to set up coverage
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium tracking-[0.2em] mb-2 text-foreground relative text-[11px] tracking-[2px]">
                  FIRST NAME
                </FormLabel>
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
                <FormLabel className="text-xs font-medium tracking-[0.2em] mb-2 text-foreground">
                  LAST NAME
                </FormLabel>
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
                <FormLabel className="text-xs font-medium tracking-[0.2em] mb-2 text-foreground">
                  EMAIL
                </FormLabel>
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
                <FormLabel className="text-xs font-medium tracking-[0.2em] mb-2 text-foreground">
                  HOW CAN WE HELP?
                </FormLabel>
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
              className="rounded-full px-6 py-2 transition-colors tracking-widest text-xs bg-transparent hover:!bg-[#414759] hover:!text-white border border-[#414759] text-[#414759]"
              disabled={buttonText !== "CONTACT US"}
            >
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default QuoteForm;
