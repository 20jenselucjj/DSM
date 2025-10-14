import { useState } from "react";
import { PortalLayout, PortalCard, PortalButton, StatusBadge, animations } from "@/components/portal";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Clock, Users, AlertCircle, CheckCircle } from "lucide-react";

// Mock data for events - in a real app, this would come from an API
const mockEvents = [
  {
    id: 1,
    title: "High School Football Championship",
    date: new Date(2024, 11, 15), // December 15, 2024
    time: "7:00 PM - 10:00 PM",
    location: "Central High School Stadium",
    type: "Football",
    status: "confirmed",
    attendees: 2,
    description: "Championship game requiring two athletic trainers for coverage.",
    requirements: ["CPR Certification", "First Aid", "Sports Medicine Experience"]
  },
  {
    id: 2,
    title: "Basketball Tournament - Day 1",
    date: new Date(2024, 11, 18), // December 18, 2024
    time: "9:00 AM - 6:00 PM",
    location: "Community Sports Center",
    type: "Basketball",
    status: "pending",
    attendees: 3,
    description: "Multi-day tournament requiring extended coverage.",
    requirements: ["CPR Certification", "First Aid", "Tournament Experience"]
  },
  {
    id: 3,
    title: "Wrestling Meet",
    date: new Date(2024, 11, 20), // December 20, 2024
    time: "6:00 PM - 9:00 PM",
    location: "North Valley High School",
    type: "Wrestling",
    status: "confirmed",
    attendees: 1,
    description: "Regional wrestling meet with multiple schools participating.",
    requirements: ["CPR Certification", "First Aid", "Wrestling Knowledge Preferred"]
  },
  {
    id: 4,
    title: "Track & Field Practice",
    date: new Date(2024, 11, 22), // December 22, 2024
    time: "3:30 PM - 5:30 PM",
    location: "University Track Complex",
    type: "Track & Field",
    status: "needs_coverage",
    attendees: 1,
    description: "Regular practice session requiring medical coverage.",
    requirements: ["CPR Certification", "First Aid"]
  }
];

const EventSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState("calendar");

  // Filter events for selected date
  const selectedDateEvents = selectedDate 
    ? mockEvents.filter(event => 
        event.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  // Get upcoming events (next 7 days)
  const upcomingEvents = mockEvents.filter(event => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return event.date >= today && event.date <= weekFromNow;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "needs_coverage": return "error";
      default: return "neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmed";
      case "pending": return "Pending Approval";
      case "needs_coverage": return "Needs Coverage";
      default: return "Unknown";
    }
  };

  return (
    <PortalLayout
      title="EVENT SCHEDULE"
      description="View upcoming assignments and event details."
      maxWidth="xl"
    >
      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className={`lg:col-span-1 ${animations.slideInFromLeft}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: mockEvents.map(event => event.date)
                  }}
                  modifiersStyles={{
                    hasEvent: { 
                      backgroundColor: 'hsl(var(--primary))', 
                      color: 'hsl(var(--primary-foreground))',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            <div className={`lg:col-span-2 space-y-4 ${animations.slideInFromRight}`}>
              <h3 className="text-xl font-semibold text-foreground">
                Events for {selectedDate?.toLocaleDateString() || "Selected Date"}
              </h3>
              
              {selectedDateEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No events scheduled for this date.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <PortalCard
                      key={event.id}
                      title={event.title}
                      description={event.description}
                      icon={CalendarDays}
                      variant="default"
                      hoverable
                      animationDelay={index * 100}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge status={getStatusColor(event.status) as any}>
                            {getStatusText(event.status)}
                          </StatusBadge>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{event.attendees} AT{event.attendees > 1 ? 's' : ''} Required</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.requirements.map((req, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <PortalButton size="sm" variant="primary">
                            View Details
                          </PortalButton>
                          {event.status === "needs_coverage" && (
                            <PortalButton size="sm" variant="outline">
                              Request Assignment
                            </PortalButton>
                          )}
                        </div>
                      </div>
                    </PortalCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className={animations.slideInFromBottom}>
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Upcoming Events (Next 7 Days)
            </h3>
            
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No upcoming events in the next 7 days.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <PortalCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    icon={CalendarDays}
                    variant={event.status === "needs_coverage" ? "accent" : "default"}
                    hoverable
                    animationDelay={index * 150}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={getStatusColor(event.status) as any}>
                          {getStatusText(event.status)}
                        </StatusBadge>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <PortalButton size="sm" variant="primary" showArrow>
                          View Details
                        </PortalButton>
                      </div>
                    </div>
                  </PortalCard>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className={animations.slideInFromBottom}>
            <h3 className="text-xl font-semibold text-foreground mb-6">
              All Scheduled Events
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockEvents.map((event, index) => (
                <PortalCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  icon={CalendarDays}
                  variant="default"
                  hoverable
                  animationDelay={index * 100}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={getStatusColor(event.status) as any}>
                        {getStatusText(event.status)}
                      </StatusBadge>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <PortalButton size="sm" variant="primary" showArrow className="w-full">
                      View Details
                    </PortalButton>
                  </div>
                </PortalCard>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PortalLayout>
  );
};

export default EventSchedule;