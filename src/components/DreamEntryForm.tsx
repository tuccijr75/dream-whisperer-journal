
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dream, DreamMood, DreamType, DreamCategory } from "@/types/dream";
import { saveDream } from "@/utils/dreamStorage";
import { useToast } from "@/hooks/use-toast";
import { Brain, Calendar, CalendarIcon, Image, Loader2, Moon, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getAIInterpretation } from "@/utils/dreamInterpreter";
import { generateDreamImage } from "@/utils/dreamImageGenerator";
import DreamInterpretation from "./DreamInterpretation";
import DreamImage from "./DreamImage";
import TagInput from "./TagInput";

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
  const [category, setCategory] = useState<DreamCategory>("uncategorized");
  const [date, setDate] = useState<Date>(new Date());
  const [interpretation, setInterpretation] = useState<string>("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

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

  const dreamCategories: { value: DreamCategory; label: string }[] = [
    { value: "personal", label: "Personal" },
    { value: "adventure", label: "Adventure" },
    { value: "fantasy", label: "Fantasy" },
    { value: "childhood", label: "Childhood" },
    { value: "spiritual", label: "Spiritual" },
    { value: "premonition", label: "Premonition" },
    { value: "uncategorized", label: "Uncategorized" },
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
      category,
      isStarred: false,
      tags: tags.length > 0 ? tags : undefined,
      interpretation: interpretation || undefined,
      imageUrl: imageUrl || undefined,
      isPublic: false,
    };

    saveDream(newDream);
    toast({
      title: "Dream saved",
      description: "Your dream has been recorded successfully",
    });
    onDreamSaved();
  };

  const handleInterpretDream = async () => {
    if (!description.trim()) {
      toast({
        title: "Cannot interpret",
        description: "Please enter a dream description first",
        variant: "destructive",
      });
      return;
    }

    setIsInterpreting(true);
    
    try {
      const result = await getAIInterpretation({ description, type, mood });
      setInterpretation(result);
      toast({
        title: "Dream interpreted",
        description: "Your dream has been analyzed",
      });
    } catch (error) {
      toast({
        title: "Interpretation failed",
        description: "Could not interpret your dream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!description.trim()) {
      toast({
        title: "Cannot generate image",
        description: "Please enter a dream description first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      const imageUrl = await generateDreamImage(description, type);
      setImageUrl(imageUrl);
      toast({
        title: "Image generated",
        description: "Your dream visualization is ready",
      });
    } catch (error) {
      toast({
        title: "Image generation failed",
        description: "Could not create an image for your dream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
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

          <div className="space-y-2">
            <Label htmlFor="category">Dream Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as DreamCategory)}>
              <SelectTrigger className="border-dream-light-purple/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {dreamCategories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput tags={tags} setTags={setTags} placeholder="Add tags (e.g., flying, water, family)..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Button 
              type="button" 
              onClick={handleInterpretDream}
              disabled={isInterpreting || !description.trim()}
              variant="outline"
              className="w-full border-dream-light-purple/30 hover:bg-dream-purple/10"
            >
              {isInterpreting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Interpreting...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Interpret Dream
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !description.trim()}
              variant="outline"
              className="w-full border-dream-light-purple/30 hover:bg-dream-purple/10"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Visualize Dream
                </>
              )}
            </Button>
          </div>

          {interpretation && (
            <div className="pt-2">
              <DreamInterpretation interpretation={interpretation} />
            </div>
          )}

          {imageUrl && (
            <div className="pt-2">
              <DreamImage imageUrl={imageUrl} />
            </div>
          )}
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
