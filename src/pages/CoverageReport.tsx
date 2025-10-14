import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CoverageReportForm = {
  eventName: string;
  date: string;
  location: string;
  summary: string;
  notes: string;
};

const CoverageReport = () => {
  const form = useForm<CoverageReportForm>({
    defaultValues: { eventName: "", date: "", location: "", summary: "", notes: "" },
  });

  const onSubmit = (values: CoverageReportForm) => {
    console.log("Coverage Report submitted", values);
    toast.success("Coverage report captured. This is a placeholder.");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="bg-background">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-[0.25em] text-secondary">COVERAGE REPORT</h1>
            <p className="mt-3 text-center text-sm sm:text-base text-muted-foreground">Submit post-event coverage details.</p>
          </div>
          <img src={heroImage} alt="Desert landscape" className="h-[200px] w-full object-cover sm:h-[280px]" />
        </section>

        <section className="bg-background">
          <div className="container mx-auto px-6 py-10 max-w-3xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., High School Track Meet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Desert Stadium" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Key coverage points, athlete care, notable events" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Additional comments or follow-ups" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoverageReport;