
import { useState, useMemo } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDreams } from "@/utils/dreamStorage";
import { Dream } from "@/types/dream";
import Header from "@/components/Header";
import DreamCard from "@/components/DreamCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isEqual, isSameDay, isSameMonth, startOfMonth, endOfMonth, getMonth, getYear } from "date-fns";

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [dreams, setDreams] = useState<Dream[]>(getDreams());

  // Reload dreams when needed
  const loadDreams = () => {
    setDreams(getDreams());
  };

  // Dreams for the selected day
  const selectedDayDreams = useMemo(() => {
    if (!selectedDay) return [];
    return dreams.filter(dream => isSameDay(new Date(dream.date), selectedDay));
  }, [dreams, selectedDay]);

  // Dates with dreams in the current month
  const dreamDates = useMemo(() => {
    const currentMonthDreams = dreams.filter(dream => 
      isSameMonth(new Date(dream.date), date)
    );
    
    return currentMonthDreams.map(dream => new Date(dream.date));
  }, [dreams, date]);

  // Handle month navigation
  const navigateMonth = (direction: 'previous' | 'next') => {
    const newDate = new Date(date);
    if (direction === 'previous') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDate(newDate);
    setSelectedDay(undefined);
  };

  return (
    <>
      <div className="background-pattern"></div>
      <div className="min-h-screen">
        <div className="container py-8 px-4 max-w-6xl relative z-10">
          <div className="flex items-center justify-between">
            <Header />
          </div>
          
          <main className="pt-4 pb-16">
            <h1 className="text-2xl font-bold text-white dream-text mb-6">Dream Calendar</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <Button 
                        variant="outline" 
                        onClick={() => navigateMonth('previous')}
                        className="border-dream-light-purple/30"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-lg font-semibold">
                        {format(date, 'MMMM yyyy')}
                      </h2>
                      <Button 
                        variant="outline" 
                        onClick={() => navigateMonth('next')}
                        className="border-dream-light-purple/30"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CalendarComponent
                      mode="single"
                      selected={selectedDay}
                      onSelect={setSelectedDay}
                      month={date}
                      className="rounded-md"
                      modifiersStyles={{
                        selected: {
                          backgroundColor: '#9b87f5',
                        }
                      }}
                      modifiers={{
                        hasDream: dreamDates
                      }}
                      modifiersClassNames={{
                        hasDream: "bg-dream-light-purple/30 font-bold"
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    {selectedDay ? (
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                          Dreams from {format(selectedDay, 'MMMM d, yyyy')}
                        </h2>
                        
                        {selectedDayDreams.length > 0 ? (
                          <div className="space-y-4">
                            {selectedDayDreams.map(dream => (
                              <DreamCard 
                                key={dream.id} 
                                dream={dream} 
                                onUpdate={loadDreams}
                                fullWidth 
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground py-8 text-center">
                            No dreams recorded for this day
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                          Select a day to view dreams
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CalendarView;
