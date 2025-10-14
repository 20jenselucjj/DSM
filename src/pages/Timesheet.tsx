import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInMinutes, parse } from "date-fns";
import { 
  PortalLayout, 
  PortalCard, 
  PortalButton, 
  LoadingSpinner,
  animations 
} from "@/components/portal";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Clock, 
  Plus, 
  Trash2, 
  Calculator, 
  Calendar,
  MapPin,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Timer,
  Zap,
  Copy
} from "lucide-react";

// Validation schema
const timesheetEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  eventType: z.string().min(1, "Event type is required"),
  duties: z.string().min(1, "Duties description is required"),
  onCall: z.boolean().default(false),
  travelTime: z.number().min(0, "Travel time must be positive").default(0),
  breakTime: z.number().min(0, "Break time must be positive").default(0),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    const start = parse(data.startTime, "HH:mm", new Date());
    const end = parse(data.endTime, "HH:mm", new Date());
    return end > start;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

const timesheetSchema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  payPeriod: z.string().min(1, "Pay period is required"),
  entries: z.array(timesheetEntrySchema).min(1, "At least one entry is required"),
  additionalNotes: z.string().optional(),
});

type TimesheetForm = z.infer<typeof timesheetSchema>;

const eventTypes = [
  "Football Game",
  "Basketball Game", 
  "Soccer Match",
  "Baseball Game",
  "Track & Field",
  "Wrestling Match",
  "Volleyball Game",
  "Tennis Match",
  "Swimming Meet",
  "Cross Country",
  "Practice Coverage",
  "Training Session",
  "Other"
];

const commonLocations = [
  "Main Stadium",
  "Gymnasium",
  "Soccer Field",
  "Baseball Diamond",
  "Track & Field Complex",
  "Tennis Courts",
  "Swimming Pool",
  "Wrestling Room",
  "Training Facility",
  "Away Game"
];

// Quick time presets for common shift durations
const timePresets = [
  { label: "2 Hours", duration: 2, startTime: "18:00", endTime: "20:00" },
  { label: "3 Hours", duration: 3, startTime: "17:00", endTime: "20:00" },
  { label: "4 Hours", duration: 4, startTime: "16:00", endTime: "20:00" },
  { label: "6 Hours", duration: 6, startTime: "14:00", endTime: "20:00" },
  { label: "8 Hours", duration: 8, startTime: "12:00", endTime: "20:00" }
];

// Common event templates
const eventTemplates = [
  {
    name: "Football Game",
    eventType: "Football Game",
    location: "Main Stadium",
    duties: "Provide medical coverage for football game, monitor players for injuries, manage sideline medical station"
  },
  {
    name: "Basketball Game", 
    eventType: "Basketball Game",
    location: "Gymnasium",
    duties: "Provide medical coverage for basketball game, monitor players and officials, manage courtside medical equipment"
  },
  {
    name: "Practice Coverage",
    eventType: "Practice Coverage", 
    location: "Training Facility",
    duties: "Provide medical coverage during practice session, monitor athlete safety, handle minor injuries"
  }
];

const Timesheet = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const form = useForm<TimesheetForm>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      staffName: "",
      employeeId: "",
      payPeriod: "",
      entries: [{
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        eventType: "",
        duties: "",
        onCall: false,
        travelTime: 0,
        breakTime: 0
      }],
      additionalNotes: ""
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries"
  });

  // Calculate hours for a single entry
  const calculateEntryHours = (entry: any) => {
    if (!entry.startTime || !entry.endTime) return 0;
    
    try {
      const start = parse(entry.startTime, "HH:mm", new Date());
      const end = parse(entry.endTime, "HH:mm", new Date());
      const totalMinutes = differenceInMinutes(end, start);
      const workMinutes = totalMinutes - (entry.breakTime || 0);
      const totalHours = (workMinutes + (entry.travelTime || 0)) / 60;
      return Math.max(0, totalHours);
    } catch {
      return 0;
    }
  };

  // Calculate total hours for all entries
  const calculateTotalHours = () => {
    const entries = form.watch("entries");
    return entries.reduce((total, entry) => total + calculateEntryHours(entry), 0);
  };

  // Apply time preset to an entry
  const applyTimePreset = (index: number, preset: typeof timePresets[0]) => {
    form.setValue(`entries.${index}.startTime`, preset.startTime);
    form.setValue(`entries.${index}.endTime`, preset.endTime);
    toast.success(`Applied ${preset.label} preset`);
  };

  // Apply event template to an entry
  const applyEventTemplate = (index: number, template: typeof eventTemplates[0]) => {
    form.setValue(`entries.${index}.eventType`, template.eventType);
    form.setValue(`entries.${index}.location`, template.location);
    form.setValue(`entries.${index}.duties`, template.duties);
    toast.success(`Applied ${template.name} template`);
  };

  // Copy entry data from one entry to another
  const copyEntry = (fromIndex: number, toIndex: number) => {
    const sourceEntry = form.watch(`entries.${fromIndex}`);
    const fieldsToKeep = ['date', 'startTime', 'endTime']; // Keep these fields unique
    
    Object.keys(sourceEntry).forEach(key => {
      if (!fieldsToKeep.includes(key)) {
        form.setValue(`entries.${toIndex}.${key}` as any, sourceEntry[key as keyof typeof sourceEntry]);
      }
    });
    toast.success("Entry details copied");
  };

  const addEntry = () => {
    append({
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      eventType: "",
      duties: "",
      onCall: false,
      travelTime: 0,
      breakTime: 0
    });
  };

  const removeEntry = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const saveDraft = async () => {
    setIsDraft(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Timesheet saved as draft");
    setIsDraft(false);
  };

  const onSubmit = async (values: TimesheetForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Timesheet submitted:", values);
      toast.success("Timesheet submitted successfully!");
      
      // Reset form after successful submission
      form.reset();
    } catch (error) {
      toast.error("Failed to submit timesheet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalHours = calculateTotalHours();

  return (
    <PortalLayout
      title="TIMESHEET SUBMISSION"
      description="Log your hours for coverage and on-call duties"
    >
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${animations.slideInFromBottom}`}>
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Staff Information */}
                <PortalCard 
                  title="Staff Information"
                  icon={Calendar}
                  className={animations.slideInUp}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="staffName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., John Smith" 
                              {...field} 
                              className={animations.focusRing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., EMP001" 
                              {...field}
                              className={animations.focusRing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="payPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pay Period *</FormLabel>
                          <FormControl>
                            <Input 
                              type="week"
                              {...field}
                              className={animations.focusRing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </PortalCard>

                {/* Time Entries */}
                <PortalCard 
                  title="Time Entries"
                  icon={Clock}
                  className={animations.slideInUp}
                >
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div 
                        key={field.id} 
                        className={`p-6 border rounded-lg bg-muted/30 ${animations.slideInUp}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">Entry {index + 1}</h4>
                          <div className="flex gap-2">
                            {index > 0 && (
                              <PortalButton
                                variant="outline"
                                size="sm"
                                onClick={() => copyEntry(0, index)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="h-4 w-4" />
                              </PortalButton>
                            )}
                            {fields.length > 1 && (
                              <PortalButton
                                variant="outline"
                                size="sm"
                                onClick={() => removeEntry(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </PortalButton>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Timer className="h-4 w-4" />
                              Quick Time Presets:
                            </span>
                            {timePresets.map((preset) => (
                              <Badge
                                key={preset.label}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => applyTimePreset(index, preset)}
                              >
                                {preset.label}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              Event Templates:
                            </span>
                            {eventTemplates.map((template) => (
                              <Badge
                                key={template.name}
                                variant="outline"
                                className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
                                onClick={() => applyEventTemplate(index, template)}
                              >
                                {template.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`entries.${index}.date`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    {...field}
                                    className={animations.focusRing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`entries.${index}.startTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time" 
                                    {...field}
                                    className={animations.focusRing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`entries.${index}.endTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time" 
                                    {...field}
                                    className={animations.focusRing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`entries.${index}.eventType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Event Type *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className={animations.focusRing}>
                                      <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {eventTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`entries.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className={animations.focusRing}>
                                      <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {commonLocations.map((location) => (
                                      <SelectItem key={location} value={location}>
                                        {location}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-center space-x-4">
                            <FormField
                              control={form.control}
                              name={`entries.${index}.onCall`}
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox 
                                      checked={field.value} 
                                      onCheckedChange={field.onChange}
                                      className={animations.focusRing}
                                    />
                                  </FormControl>
                                  <FormLabel className="!m-0 text-sm">On-call</FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`entries.${index}.travelTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Travel Time (minutes)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className={animations.focusRing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`entries.${index}.breakTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Break Time (minutes)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className={animations.focusRing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`entries.${index}.duties`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Duties Performed *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  rows={3}
                                  placeholder="Describe the duties performed during this time period..."
                                  {...field}
                                  className={animations.focusRing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Enhanced Hours calculation for this entry */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calculator className="h-5 w-5 text-primary" />
                              <span className="font-medium text-foreground">Entry Hours Breakdown</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {calculateEntryHours(form.watch(`entries.${index}`)).toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">Total Hours</div>
                            </div>
                          </div>
                          
                          {/* Detailed breakdown */}
                          {(() => {
                            const entry = form.watch(`entries.${index}`);
                            if (!entry.startTime || !entry.endTime) return null;
                            
                            try {
                              const start = parse(entry.startTime, "HH:mm", new Date());
                              const end = parse(entry.endTime, "HH:mm", new Date());
                              const totalMinutes = differenceInMinutes(end, start);
                              const workMinutes = totalMinutes - (entry.breakTime || 0);
                              
                              return (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                  <div className="text-center p-2 bg-background/50 rounded">
                                    <div className="font-medium">{(totalMinutes / 60).toFixed(1)}h</div>
                                    <div className="text-muted-foreground">Total Time</div>
                                  </div>
                                  <div className="text-center p-2 bg-background/50 rounded">
                                    <div className="font-medium">{entry.breakTime || 0}m</div>
                                    <div className="text-muted-foreground">Break Time</div>
                                  </div>
                                  <div className="text-center p-2 bg-background/50 rounded">
                                    <div className="font-medium">{entry.travelTime || 0}m</div>
                                    <div className="text-muted-foreground">Travel Time</div>
                                  </div>
                                  <div className="text-center p-2 bg-primary/10 rounded">
                                    <div className="font-medium text-primary">{(workMinutes / 60).toFixed(1)}h</div>
                                    <div className="text-muted-foreground">Work Time</div>
                                  </div>
                                </div>
                              );
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      </div>
                    ))}

                    <PortalButton
                      type="button"
                      variant="outline"
                      onClick={addEntry}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Entry
                    </PortalButton>
                  </div>
                </PortalCard>

                {/* Total Hours Summary */}
                <PortalCard 
                  title="Hours Summary"
                  icon={Clock}
                  className={animations.slideInUp}
                >
                  <div className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/20 rounded-full">
                          <Calculator className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Total Hours</h3>
                          <p className="text-sm text-muted-foreground">All entries combined</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-primary">
                          {calculateTotalHours().toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Hours</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-lg font-semibold text-foreground">
                          {form.watch("entries").length}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Entries</div>
                      </div>
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-lg font-semibold text-foreground">
                          {form.watch("entries").reduce((total, entry) => total + (entry.travelTime || 0), 0)}m
                        </div>
                        <div className="text-xs text-muted-foreground">Total Travel</div>
                      </div>
                      <div className="text-center p-3 bg-background/50 rounded-lg">
                        <div className="text-lg font-semibold text-foreground">
                          {form.watch("entries").reduce((total, entry) => total + (entry.breakTime || 0), 0)}m
                        </div>
                        <div className="text-xs text-muted-foreground">Total Breaks</div>
                      </div>
                    </div>
                    
                    {calculateTotalHours() > 40 && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-800">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Overtime Alert: {(calculateTotalHours() - 40).toFixed(2)} hours over 40
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </PortalCard>

                {/* Additional Notes */}
                <PortalCard 
                  title="Additional Notes"
                  className={animations.slideInUp}
                >
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="Any additional notes, special circumstances, or comments..."
                            {...field}
                            className={animations.focusRing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </PortalCard>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <PortalButton
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isDraft || isSubmitting}
                    className="order-2 sm:order-1"
                  >
                    {isDraft ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Draft
                  </PortalButton>
                  
                  <PortalButton
                    type="submit"
                    disabled={isSubmitting || isDraft}
                    className="order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit Timesheet
                  </PortalButton>
                </div>
              </form>
            </Form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Hours Summary */}
              <PortalCard 
                title="Hours Summary"
                icon={Calculator}
                className={animations.slideInUp}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {totalHours.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entries:</span>
                      <span>{fields.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regular Hours:</span>
                      <span>{Math.min(totalHours, 40).toFixed(2)}</span>
                    </div>
                    {totalHours > 40 && (
                      <div className="flex justify-between text-amber-600">
                        <span>Overtime:</span>
                        <span>{(totalHours - 40).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </PortalCard>

              {/* Quick Tips */}
              <PortalCard 
                title="Quick Tips"
                icon={AlertCircle}
                className={animations.slideInUp}
              >
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Include travel time for away games</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Deduct break time from total hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Mark on-call duties appropriately</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Save drafts frequently</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Submit by end of pay period</span>
                  </div>
                </div>
              </PortalCard>

              {/* Required Fields */}
              <PortalCard 
                title="Required Fields"
                className={animations.slideInUp}
              >
                <div className="space-y-2 text-sm">
                  <Badge variant="secondary" className="w-full justify-start">
                    <span className="text-destructive mr-1">*</span>
                    Staff Information
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    <span className="text-destructive mr-1">*</span>
                    Date & Times
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    <span className="text-destructive mr-1">*</span>
                    Event Type & Location
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    <span className="text-destructive mr-1">*</span>
                    Duties Performed
                  </Badge>
                </div>
              </PortalCard>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Timesheet;