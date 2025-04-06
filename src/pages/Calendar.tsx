
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Dream, DreamTemplate } from "@/types/dream";
import { getDreams } from "@/utils/dreamStorage";
import { format } from "date-fns";
import DreamEntryForm from "@/components/DreamEntryForm";
import DreamList from "@/components/DreamList";
import DreamTemplates from "@/components/DreamTemplates";
import DreamReminder from "@/components/DreamReminder";
import { Calendar as CalendarIcon, Template, AlarmClock } from "lucide-react";

const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedTemplate, setSelectedTemplate] = useState<DreamTemplate | null>(null);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = () => {
    const allDreams = getDreams();
    setDreams(allDreams);
  };

  const dreamsForDate = (date: Date | undefined) => {
    if (!date) return [];
    const dateString = format(date, "yyyy-MM-dd");
    return dreams.filter(
      (dream) => format(new Date(dream.date), "yyyy-MM-dd") === dateString
    );
  };

  const getDreamDates = () => {
    const dates = new Set<string>();
    dreams.forEach((dream) => {
      dates.add(format(new Date(dream.date), "yyyy-MM-dd"));
    });
    return Array.from(dates).map((date) => new Date(date));
  };

  const handleAddDream = () => {
    setIsAddingDream(true);
    setActiveTab("calendar");
  };

  const handleTemplateSelected = (template: DreamTemplate) => {
    setSelectedTemplate(template);
    setIsAddingDream(true);
    setActiveTab("calendar");
  };

  const handleDreamSaved = () => {
    setIsAddingDream(false);
    setSelectedTemplate(null);
    loadDreams();
  };

  const handleCancel = () => {
    setIsAddingDream(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="calendar" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Template className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <AlarmClock className="h-4 w-4" />
            <span className="hidden sm:inline">Reminders</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          {isAddingDream ? (
            <DreamEntryForm 
              onDreamSaved={handleDreamSaved} 
              onCancel={handleCancel} 
              initialTemplate={selectedTemplate}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/50 backdrop-blur-sm border border-dream-light-purple/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-dream-purple" />
                    Dream Calendar
                  </CardTitle>
                  <CardDescription>
                    Select a date to view dreams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border border-dream-light-purple/20"
                    highlightedDays={getDreamDates()}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border border-dream-light-purple/30">
                <CardHeader>
                  <CardTitle>
                    {date
                      ? `Dreams on ${format(date, "MMMM d, yyyy")}`
                      : "Select a date"}
                  </CardTitle>
                  <CardDescription>
                    {date ? (
                      dreamsForDate(date).length > 0
                        ? `You have ${dreamsForDate(date).length} dream${
                            dreamsForDate(date).length > 1 ? "s" : ""
                          } recorded`
                        : "No dreams recorded for this date"
                    ) : (
                      "Select a date from the calendar"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {date && dreamsForDate(date).length > 0 ? (
                    <DreamList
                      dreams={dreamsForDate(date)}
                      onUpdate={loadDreams}
                      simplified
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        {date
                          ? "No dreams recorded for this date. Add one now!"
                          : "Select a date to view your dreams"}
                      </p>
                      {date && (
                        <button
                          className="text-dream-purple hover:underline"
                          onClick={handleAddDream}
                        >
                          Record a dream for this date
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <DreamTemplates 
            onSelectTemplate={handleTemplateSelected} 
            onCreateNewDream={handleAddDream} 
          />
        </TabsContent>

        <TabsContent value="reminders">
          <DreamReminder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarView;
