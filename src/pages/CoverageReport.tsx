import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { PortalLayout, PortalCard, PortalButton, StatusBadge, LoadingSpinner, animations } from "@/components/portal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Heart, 
  Package, 
  MessageSquare,
  CheckCircle,
  Save,
  Send
} from "lucide-react";

// Form validation schema
const coverageReportSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  eventType: z.string().min(1, "Event type is required"),
  attendees: z.string().min(1, "Number of attendees is required"),
  weatherConditions: z.string().optional(),
  injuryOccurred: z.boolean(),
  injuryDetails: z.string().optional(),
  injuryType: z.string().optional(),
  interventions: z.string().optional(),
  equipmentUsed: z.array(z.string()).optional(),
  referralMade: z.boolean(),
  referralDetails: z.string().optional(),
  followUpRequired: z.boolean(),
  followUpDetails: z.string().optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional()
});

type CoverageReportForm = z.infer<typeof coverageReportSchema>;

const CoverageReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const { toast } = useToast();

  const form = useForm<CoverageReportForm>({
    resolver: zodResolver(coverageReportSchema),
    defaultValues: {
      injuryOccurred: false,
      referralMade: false,
      followUpRequired: false,
      equipmentUsed: []
    }
  });

  const watchInjuryOccurred = form.watch("injuryOccurred");
  const watchReferralMade = form.watch("referralMade");
  const watchFollowUpRequired = form.watch("followUpRequired");

  const equipmentOptions = [
    "Ice packs", "Elastic bandages", "Crutches", "Splints", 
    "AED", "First aid kit", "Stretcher", "Spine board",
    "Oxygen", "Blood pressure cuff", "Thermometer", "Other"
  ];

  const onSubmit = async (data: CoverageReportForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Coverage Report Data:", data);
      toast({
        title: "Coverage Report Submitted",
        description: "Your coverage report has been successfully submitted and will be reviewed.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    setIsDraft(true);
    try {
      // Simulate saving draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Draft Saved",
        description: "Your coverage report has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDraft(false);
    }
  };

  return (
    <PortalLayout
      title="COVERAGE REPORT"
      description="Submit your post-event coverage report with detailed information."
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Event Information */}
              <PortalCard
                title="Event Information"
                description="Basic details about the event you covered"
                icon={Calendar}
                variant="default"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
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
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="baseball">Baseball</SelectItem>
                            <SelectItem value="track">Track & Field</SelectItem>
                            <SelectItem value="wrestling">Wrestling</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Attendees *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter number of attendees" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weatherConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weather Conditions</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sunny, 75°F, Light wind" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: Weather conditions during the event
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </PortalCard>

              {/* Injury/Incident Information */}
              <PortalCard
                title="Injury & Incident Information"
                description="Details about any injuries or incidents that occurred"
                icon={AlertTriangle}
                variant="default"
              >
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="injuryOccurred"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            An injury or incident occurred during this event
                          </FormLabel>
                          <FormDescription>
                            Check this box if any injuries or incidents happened
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchInjuryOccurred && (
                    <div className={`space-y-6 ${animations.slideInFromTop}`}>
                      <FormField
                        control={form.control}
                        name="injuryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Injury/Incident</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select injury type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sprain">Sprain/Strain</SelectItem>
                                <SelectItem value="fracture">Fracture</SelectItem>
                                <SelectItem value="concussion">Concussion</SelectItem>
                                <SelectItem value="laceration">Laceration</SelectItem>
                                <SelectItem value="contusion">Contusion</SelectItem>
                                <SelectItem value="heat-illness">Heat-related Illness</SelectItem>
                                <SelectItem value="cardiac">Cardiac Event</SelectItem>
                                <SelectItem value="respiratory">Respiratory Issue</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="injuryDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Injury/Incident Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide detailed description of the injury or incident, including mechanism of injury, body part affected, and circumstances"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </PortalCard>

              {/* Medical Interventions */}
              <PortalCard
                title="Medical Interventions"
                description="Treatments and interventions provided"
                icon={Heart}
                variant="default"
              >
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="interventions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interventions Provided</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any medical interventions, treatments, or first aid provided"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include assessment findings, treatments given, and patient response
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equipmentUsed"
                    render={() => (
                      <FormItem>
                        <FormLabel>Equipment Used</FormLabel>
                        <FormDescription>
                          Select all equipment that was used during the event
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          {equipmentOptions.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="equipmentUsed"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {item}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </PortalCard>

              {/* Follow-up & Referrals */}
              <PortalCard
                title="Follow-up & Referrals"
                description="Information about referrals and follow-up care"
                icon={FileText}
                variant="default"
              >
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="referralMade"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Referral to medical professional was made
                          </FormLabel>
                          <FormDescription>
                            Check if athlete was referred for further medical evaluation
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchReferralMade && (
                    <FormField
                      control={form.control}
                      name="referralDetails"
                      render={({ field }) => (
                        <FormItem className={animations.slideInFromTop}>
                          <FormLabel>Referral Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the referral made (e.g., to physician, emergency room, specialist)"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="followUpRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Follow-up care is required
                          </FormLabel>
                          <FormDescription>
                            Check if ongoing monitoring or follow-up is needed
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchFollowUpRequired && (
                    <FormField
                      control={form.control}
                      name="followUpDetails"
                      render={({ field }) => (
                        <FormItem className={animations.slideInFromTop}>
                          <FormLabel>Follow-up Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the follow-up care needed and timeline"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </PortalCard>

              {/* Additional Information */}
              <PortalCard
                title="Additional Information"
                description="Notes and recommendations"
                icon={MessageSquare}
                variant="default"
              >
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional observations, concerns, or relevant information"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recommendations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommendations</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Recommendations for future events, safety improvements, or policy changes"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </PortalCard>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <PortalButton
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isDraft}
                  icon={Save}
                  className="flex-1"
                >
                  {isDraft ? <LoadingSpinner size="sm" /> : "Save Draft"}
                </PortalButton>
                
                <PortalButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={Send}
                  showArrow
                  className="flex-1"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit Report"}
                </PortalButton>
              </div>
            </form>
          </Form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Quick Tips */}
            <Card className={animations.slideInFromRight}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p>• Complete the report within 24 hours of the event</p>
                  <p>• Be specific and detailed in your descriptions</p>
                  <p>• Include all relevant medical information</p>
                  <p>• Save drafts frequently to avoid losing data</p>
                  <p>• Contact your supervisor for urgent matters</p>
                </div>
              </CardContent>
            </Card>

            {/* Required Fields */}
            <Card className={animations.slideInFromRight}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Required Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p>• Event Name</p>
                  <p>• Event Date & Times</p>
                  <p>• Location</p>
                  <p>• Event Type</p>
                  <p>• Number of Attendees</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CoverageReport;