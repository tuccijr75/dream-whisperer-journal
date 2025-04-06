
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dream, DreamMood, DreamType } from "@/types/dream";
import { saveDream } from "@/utils/dreamStorage";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CalendarIcon, Moon, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DreamEntryFormProps {
  onDreamSaved: () => void;
  onCancel: () => void;
}

const DreamEntryForm = ({ onDreamSaved, onCancel }: DreamEntryFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState<DreamMood>("peaceful");
  const [type, setType] = useState<DreamType>("normal");
  const [date, setDate] = useState<Date>(new Date());

  const dreamMoods: { value: DreamMood; label: string }[] = [
    { value: "happy", label: "Happy" },
    { value: "sad", label: "Sad" },
    { value: "scared", label: "Scared" },
    { value: "confused", label: "Confused" },
    { value: "peaceful", label: "Peaceful" },
    { value: "excited", label: "Excited" },
  ];

  const dreamTypes: { value: DreamType; label: string }[] = [
    { value: "normal", label: "Normal Dream" },
    { value: "lucid", label: "Lucid Dream" },
    { value: "nightmare", label: "Nightmare" },
    { value: "recurring", label: "Recurring Dream" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a dream title",
        variant: "destructive",
      });
      return;
    }

    const newDream: Dream = {
      id: crypto.randomUUID(),
      title,
      description,
      date: date.toISOString(),
      mood,
      type,
      isStarred: false,
    };

    saveDream(newDream);
    toast({
      title: "Dream saved",
      description: "Your dream has been recorded successfully",
    });
    onDreamSaved();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
      <CardHeader className="bg-dream-gradient text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Record New Dream
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Dream Title</Label>
            <Input
              id="title"
              placeholder="Enter a name for your dream"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-dream-light-purple/30 focus:border-dream-purple"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Dream Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened in your dream..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] border-dream-light-purple/30 focus:border-dream-purple"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Dream Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-dream-light-purple/30",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">How did you feel?</Label>
              <Select value={mood} onValueChange={(value) => setMood(value as DreamMood)}>
                <SelectTrigger className="border-dream-light-purple/30">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {dreamMoods.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Dream Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as DreamType)}>
                <SelectTrigger className="border-dream-light-purple/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {dreamTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-dream-gradient hover:opacity-90 transition-opacity">
            Save Dream
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DreamEntryForm;
