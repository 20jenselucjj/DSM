import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type IncidentLogForm = {
  athleteName: string;
  team: string;
  injuryType: string;
  timeOccurred: string;
  notes: string;
};

const IncidentLog = () => {
  const form = useForm<IncidentLogForm>({
    defaultValues: { athleteName: "", team: "", injuryType: "", timeOccurred: "", notes: "" },
  });

  const onSubmit = (values: IncidentLogForm) => {
    console.log("Incident Log submitted", values);
    toast.success("Incident logged. This is a placeholder.");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="bg-background">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-[0.25em] text-secondary">INCIDENT LOG</h1>
            <p className="mt-3 text-center text-sm sm:text-base text-muted-foreground">Record injuries and on-site interventions.</p>
          </div>
          <img src={heroImage} alt="Desert landscape" className="h-[200px] w-full object-cover sm:h-[280px]" />
        </section>

        <section className="bg-background">
          <div className="container mx-auto px-6 py-10 max-w-3xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="athleteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Athlete Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Desert High Varsity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="injuryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sprain">Sprain</SelectItem>
                            <SelectItem value="strain">Strain</SelectItem>
                            <SelectItem value="contusion">Contusion</SelectItem>
                            <SelectItem value="laceration">Laceration</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeOccurred"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Occurred</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
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
                        <Textarea rows={4} placeholder="Treatment provided, recommendations, follow-up" {...field} />
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

export default IncidentLog;