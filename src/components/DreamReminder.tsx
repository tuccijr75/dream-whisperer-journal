import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlarmClock, Plus, Check, X, Volume2, Bell, AlarmClockCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type DreamReminder } from "@/types/dream";
import { getReminders, saveReminder, updateReminder, deleteReminder, toggleReminderStatus } from "@/utils/templateStorage";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DreamReminderComponent = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<DreamReminder[]>(getReminders());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<DreamReminder | null>(null);
  const [editTime, setEditTime] = useState("07:00");
  const [editDays, setEditDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [editSound, setEditSound] = useState<"gentle" | "nature" | "crystal" | "none">("gentle");
  const [editVolume, setEditVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    refreshReminders();
    
    // Setup alarm clock check interval
    const checkInterval = setInterval(checkAlarms, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(checkInterval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = editVolume / 100;
      audioRef.current.play().catch(error => {
        console.error("Failed to play audio:", error);
        toast({
          title: "Audio playback failed",
          description: "Please interact with the page first to enable audio",
          variant: "destructive"
        });
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, editVolume]);

  const refreshReminders = () => {
    setReminders(getReminders());
  };

  const handleAddReminder = () => {
    setSelectedReminder(null);
    setEditTime("07:00");
    setEditDays([1, 2, 3, 4, 5]);
    setEditSound("gentle");
    setEditVolume(50);
    setIsDialogOpen(true);
  };

  const handleEditReminder = (reminder: DreamReminder) => {
    setSelectedReminder(reminder);
    setEditTime(reminder.time);
    setEditDays(reminder.days);
    setEditSound(reminder.sound);
    setEditVolume(reminder.volume);
    setIsDialogOpen(true);
  };

  const handleSaveReminder = () => {
    if (!editTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      toast({
        title: "Invalid time format",
        description: "Please use HH:MM format (e.g., 07:30)",
        variant: "destructive"
      });
      return;
    }

    if (editDays.length === 0) {
      toast({
        title: "No days selected",
        description: "Please select at least one day of the week",
        variant: "destructive"
      });
      return;
    }

    const updatedReminder: DreamReminder = {
      id: selectedReminder ? selectedReminder.id : crypto.randomUUID(),
      time: editTime,
      days: editDays,
      enabled: selectedReminder ? selectedReminder.enabled : false,
      sound: editSound,
      volume: editVolume
    };

    if (selectedReminder) {
      updateReminder(updatedReminder);
      toast({
        title: "Reminder updated",
        description: "Your dream reminder has been updated"
      });
    } else {
      saveReminder(updatedReminder);
      toast({
        title: "Reminder created",
        description: "Your new dream reminder has been set"
      });
    }

    refreshReminders();
    setIsDialogOpen(false);
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    refreshReminders();
    toast({
      title: "Reminder deleted",
      description: "The dream reminder has been removed"
    });
  };

  const handleToggleReminder = (id: string, enabled: boolean) => {
    toggleReminderStatus(id, enabled);
    refreshReminders();
    toast({
      title: enabled ? "Reminder enabled" : "Reminder disabled",
      description: enabled 
        ? "You will be notified at the scheduled time" 
        : "You will no longer be notified for this reminder"
    });
  };

  const toggleDaySelection = (day: number) => {
    if (editDays.includes(day)) {
      setEditDays(editDays.filter(d => d !== day));
    } else {
      setEditDays([...editDays, day].sort());
    }
  };

  const getDaysLabel = (days: number[]) => {
    if (days.length === 7) return "Every day";
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return "Weekdays";
    if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";
    
    if (days.length <= 3) {
      return days.map(day => WEEKDAYS[day].substring(0, 3)).join(", ");
    }
    
    return `${days.length} days`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${amPm}`;
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;
    const currentDay = now.getDay();

    const activeReminders = reminders.filter(reminder => 
      reminder.enabled && 
      reminder.time === currentTime && 
      reminder.days.includes(currentDay) &&
      reminder.sound !== 'none'
    );

    if (activeReminders.length > 0) {
      // Trigger the alarm for the first matching reminder
      triggerAlarm(activeReminders[0]);
    }
  };

  const triggerAlarm = (reminder: DreamReminder) => {
    setActiveAlarmId(reminder.id);
    setShowAlarm(true);
    
    // Set up audio
    const soundMap = {
      gentle: "/gentle-wake.mp3",
      nature: "/nature-sounds.mp3",
      crystal: "/crystal-bells.mp3",
      none: ""
    };
    
    const audioPath = window.location.origin + (soundMap[reminder.sound] || soundMap.gentle);
    if (!audioRef.current) {
      audioRef.current = new Audio(audioPath);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = audioPath;
    }
    audioRef.current.volume = reminder.volume / 100;
    audioRef.current.play().catch(console.error);
  };

  const dismissAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setShowAlarm(false);
    setActiveAlarmId(null);

    toast({
      title: "Time to record your dream",
      description: "Don't forget to write down your dream while it's still fresh in your memory!",
    });
  };

  const previewSound = () => {
    const soundMap = {
      gentle: "/gentle-wake.mp3",
      nature: "/nature-sounds.mp3",
      crystal: "/crystal-bells.mp3",
      none: ""
    };
    
    if (editSound === 'none') {
      toast({
        title: "Sound is set to none",
        description: "No sound will play for this reminder"
      });
      return;
    }
    
    const audioPath = window.location.origin + (soundMap[editSound] || soundMap.gentle);
    if (!audioRef.current) {
      audioRef.current = new Audio(audioPath);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = audioPath;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = editVolume / 100;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <Card className="bg-white/50 backdrop-blur-sm border border-dream-light-purple/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-dream-purple" />
            Dream Reminders
          </CardTitle>
          <CardDescription>Set reminders to record your dreams when you wake up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No reminders set. Create one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-dream-light-purple/20"
                >
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)}
                    />
                    <div>
                      <div className="font-medium">{formatTime(reminder.time)}</div>
                      <div className="text-sm text-muted-foreground">{getDaysLabel(reminder.days)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.sound !== 'none' && (
                      <Volume2 className="h-4 w-4 text-dream-purple opacity-60" />
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-dream-purple"
                      onClick={() => handleEditReminder(reminder)}
                    >
                      <AlarmClockCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddReminder} className="w-full bg-dream-gradient hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedReminder ? "Edit Reminder" : "New Reminder"}</DialogTitle>
            <DialogDescription>
              Set a time to be reminded to record your dreams
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Time</Label>
              <Input 
                type="time" 
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day, index) => (
                  <Button 
                    key={index}
                    type="button"
                    variant={editDays.includes(index) ? "default" : "outline"}
                    className={`h-9 px-2 text-xs ${editDays.includes(index) ? 'bg-dream-purple' : 'border-dream-light-purple/30'}`}
                    onClick={() => toggleDaySelection(index)}
                  >
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sound</Label>
              <div className="flex gap-2">
                <Select value={editSound} onValueChange={(value) => setEditSound(value as any)}>
                  <SelectTrigger className="flex-1 border-dream-light-purple/30">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gentle">Gentle Wake</SelectItem>
                    <SelectItem value="nature">Nature Sounds</SelectItem>
                    <SelectItem value="crystal">Crystal Bells</SelectItem>
                    <SelectItem value="none">No Sound</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="border-dream-light-purple/30"
                  onClick={previewSound}
                >
                  {isPlaying ? <X className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {editSound !== 'none' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Volume</Label>
                  <span className="text-sm text-muted-foreground">{editVolume}%</span>
                </div>
                <Slider
                  value={[editVolume]}
                  max={100}
                  step={1}
                  onValueChange={(values) => setEditVolume(values[0])}
                />
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button 
              variant="destructive" 
              type="button" 
              onClick={() => {
                if (selectedReminder) handleDeleteReminder(selectedReminder.id);
                setIsDialogOpen(false);
              }}
              className={!selectedReminder ? 'invisible' : ''}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveReminder} className="bg-dream-gradient hover:opacity-90">
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alarm Dialog */}
      <Dialog open={showAlarm} onOpenChange={(open) => !open && dismissAlarm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Time to Record Your Dream!</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <AlarmClock className="h-16 w-16 text-dream-purple animate-pulse" />
            </div>
            <p className="text-lg mb-2">Good Morning!</p>
            <p className="text-muted-foreground">
              Take a moment to record your dream while it's still fresh in your memory.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={dismissAlarm}
              className="w-full bg-dream-gradient hover:opacity-90"
            >
              <Check className="mr-2 h-4 w-4" />
              I'll Record My Dream
            </Button>
            <Button
              variant="outline"
              onClick={dismissAlarm}
              className="w-full"
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DreamReminderComponent;
