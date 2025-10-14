import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import PortalLayout from "@/components/portal/PortalLayout";
import PortalCard from "@/components/portal/PortalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  Send,
  User,
  Building,
  PhoneCall,
  MessageCircle,
  Headphones,
  Users,
  Star,
  ExternalLink
} from "lucide-react";

// Contact form validation schema
const contactSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["scheduling", "assignment", "emergency", "technical", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  contactMethod: z.enum(["email", "phone", "text"]),
  phoneNumber: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Mock coordinator data
const coordinatorInfo = {
  name: "Sarah Johnson",
  title: "Athletic Training Coordinator",
  department: "DSM Sports Medicine",
  email: "sarah.johnson@dsm.com",
  phone: "(555) 123-4567",
  emergencyPhone: "(555) 987-6543",
  officeHours: "Monday - Friday, 8:00 AM - 6:00 PM",
  responseTime: "Within 2-4 hours during business hours",
  location: "DSM Sports Medicine Center, Suite 200",
  specialties: ["Event Scheduling", "AT Assignments", "Emergency Response", "Compliance"],
};

// Mock recent communications
const recentCommunications = [
  {
    id: 1,
    date: "2024-01-15",
    subject: "Schedule Change - Basketball Tournament",
    status: "resolved",
    priority: "high",
    method: "email",
  },
  {
    id: 2,
    date: "2024-01-14",
    subject: "Equipment Request for Soccer Event",
    status: "pending",
    priority: "medium",
    method: "phone",
  },
  {
    id: 3,
    date: "2024-01-12",
    subject: "Certification Renewal Question",
    status: "resolved",
    priority: "low",
    method: "email",
  },
];

// Quick contact options
const quickContactOptions = [
  {
    title: "Emergency Contact",
    description: "For urgent situations requiring immediate attention",
    icon: AlertCircle,
    action: "emergency",
    color: "destructive",
  },
  {
    title: "Schedule Changes",
    description: "Report schedule conflicts or request changes",
    icon: Calendar,
    action: "schedule",
    color: "primary",
  },
  {
    title: "Assignment Questions",
    description: "Questions about current or upcoming assignments",
    icon: Users,
    action: "assignment",
    color: "secondary",
  },
  {
    title: "General Support",
    description: "General questions and administrative support",
    icon: Headphones,
    action: "general",
    color: "accent",
  },
];

const ContactCoordinator = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      priority: "medium",
      category: "general",
      message: "",
      contactMethod: "email",
      phoneNumber: "",
    },
  });

  // Handle quick contact actions
  const handleQuickAction = (action: string) => {
    setSelectedQuickAction(action);
    
    switch (action) {
      case "emergency":
        // For emergency, show immediate contact options
        toast.error("For emergencies, call immediately: " + coordinatorInfo.emergencyPhone);
        break;
      case "schedule":
        form.setValue("category", "scheduling");
        form.setValue("priority", "high");
        form.setValue("subject", "Schedule Change Request");
        setShowContactForm(true);
        break;
      case "assignment":
        form.setValue("category", "assignment");
        form.setValue("priority", "medium");
        form.setValue("subject", "Assignment Question");
        setShowContactForm(true);
        break;
      case "general":
        form.setValue("category", "general");
        form.setValue("priority", "low");
        setShowContactForm(true);
        break;
    }
  };

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Message sent successfully! You'll receive a response within " + coordinatorInfo.responseTime.toLowerCase());
      form.reset();
      setShowContactForm(false);
      setSelectedQuickAction(null);
    } catch (error) {
      toast.error("Failed to send message. Please try again or call directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      urgent: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    return status === "resolved" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <PortalLayout
      title="Contact Coordinator"
      description="Connect with your DSM coordinator for support, scheduling, and assistance"
    >
      <div className="space-y-6">
        {/* Coordinator Information Card */}
        <PortalCard
          title="Your Coordinator"
          description="Direct contact information and availability"
          icon={User}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coordinator Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{coordinatorInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{coordinatorInfo.title}</p>
                  <p className="text-sm text-muted-foreground">{coordinatorInfo.department}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{coordinatorInfo.email}</span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{coordinatorInfo.phone}</span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    <PhoneCall className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Emergency: {coordinatorInfo.emergencyPhone}</span>
                  <Button size="sm" variant="destructive" className="ml-auto">
                    <Phone className="h-3 w-3 mr-1" />
                    Emergency
                  </Button>
                </div>
              </div>
            </div>

            {/* Availability & Info */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Office Hours</span>
                </div>
                <p className="text-sm text-muted-foreground">{coordinatorInfo.officeHours}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Response Time</span>
                </div>
                <p className="text-sm text-muted-foreground">{coordinatorInfo.responseTime}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Location</span>
                </div>
                <p className="text-sm text-muted-foreground">{coordinatorInfo.location}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Specialties</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {coordinatorInfo.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PortalCard>

        {/* Quick Contact Options */}
        <PortalCard
          title="Quick Contact"
          description="Choose the type of assistance you need"
          icon={MessageSquare}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickContactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.action}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-primary"
                  onClick={() => handleQuickAction(option.action)}
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{option.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </PortalCard>

        {/* Contact Form */}
        {showContactForm && (
          <PortalCard
            title="Send Message"
            description="Fill out the form below to contact your coordinator"
            icon={Send}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your request" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="scheduling">Scheduling</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How should we respond?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="text">Text Message</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("contactMethod") === "phone" || form.watch("contactMethod") === "text" ? (
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details about your request..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowContactForm(false);
                      setSelectedQuickAction(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </PortalCard>
        )}

        {/* Recent Communications */}
        <PortalCard
          title="Recent Communications"
          description="Your recent messages and their status"
          icon={MessageCircle}
        >
          <div className="space-y-4">
            {recentCommunications.map((comm) => (
              <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{comm.subject}</h4>
                    <Badge className={getPriorityBadge(comm.priority)}>
                      {comm.priority}
                    </Badge>
                    <Badge className={getStatusBadge(comm.status)}>
                      {comm.status === "resolved" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {comm.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{format(new Date(comm.date), "MMM dd, yyyy")}</span>
                    <span>via {comm.method}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </PortalCard>

        {/* Show Contact Form Button */}
        {!showContactForm && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowContactForm(true)}
              size="lg"
              className="px-8"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Send New Message
            </Button>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default ContactCoordinator;