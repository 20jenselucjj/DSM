import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInMinutes, parse, startOfWeek, endOfWeek } from "date-fns";
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

// Removed predefined event types and locations (using free text inputs)

// Removed quick time presets

// Removed event templates

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

  // Removed quick preset and event template helpers

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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${animations.slideInFromBottom}`}>
          {/* Main Form */}
          <div className="lg:col-span-4 max-w-4xl mx-auto w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Staff Information */}
                <PortalCard 
                  title="Staff Information"
                  icon={Calendar}
                  className={animations.slideInUp}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal truncate text-xs sm:text-sm",
                                  !field.value && "text-muted-foreground",
                                  animations.focusRing
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(parse(field.value, "RRRR-'W'II", new Date()), "PPP")
                                  : <span className="truncate text-xs sm:text-sm">Pick pay period week</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[calc(100vw-2rem)] sm:w-auto" align="start">
                              <DatePicker
                                mode="range"
                                selected={(() => {
                                  if (!field.value) return undefined;
                                  const base = parse(field.value, "RRRR-'W'II", new Date());
                                  const from = startOfWeek(base, { weekStartsOn: 1 });
                                  const to = endOfWeek(base, { weekStartsOn: 1 });
                                  return { from, to };
                                })()}
                                onDayClick={(date) => {
                                  const weekValue = format(date, "RRRR-'W'II");
                                  form.setValue("payPeriod", weekValue, { shouldValidate: true });
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
                          <h4 className="font-semibold text-lg">Entry {index + 1}</h4>
                          <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
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

                        {/* Removed Quick Actions (time presets and event templates) */}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`entries.${index}.date`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date *</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal truncate text-xs sm:text-sm",
                                        !field.value && "text-muted-foreground",
                                        animations.focusRing
                                      )}
                                    >
                                      <Calendar className="mr-2 h-4 w-4" />
                                      {field.value
                                        ? format(parse(field.value, "yyyy-MM-dd", new Date()), "PPP")
                                        : <span className="truncate text-xs sm:text-sm">Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="p-0 w-[calc(100vw-2rem)] sm:w-auto" align="start">
                                    <DatePicker
                                      mode="single"
                                      selected={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                                      onSelect={(date) => {
                                        if (date) {
                                          const formatted = format(date, "yyyy-MM-dd");
                                          form.setValue(`entries.${index}.date`, formatted, { shouldValidate: true });
                                        }
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
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
                                    step="900"
                                    placeholder="HH:MM"
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
                                    step="900"
                                    placeholder="HH:MM"
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
                                <FormControl>
                                  <Input 
                                    type="text"
                                    placeholder="Enter event type"
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
                            name={`entries.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="text"
                                    placeholder="Enter location"
                                    {...field}
                                    className={animations.focusRing}
                                  />
                                </FormControl>
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
                                  <FormLabel className="!m-0 text-xs sm:text-sm">On-call</FormLabel>
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
                        {/* Removed per-entry hours breakdown */}
                      </div>
                    ))}

                    <PortalButton
                      type="button"
                      variant="outline"
                      onClick={addEntry}
                      className="w-full sm:w-auto text-white"
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
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-lg border border-primary/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/20 rounded-full">
                          <Calculator className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Total Hours</h3>
                          <p className="text-sm text-muted-foreground">All entries combined</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-3xl sm:text-4xl font-bold text-primary">
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
                    className="order-2 sm:order-1 text-white"
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

          {/* Sidebar (hidden until content is added) */}
          <div className="hidden"></div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Timesheet;