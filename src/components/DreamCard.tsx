
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dream } from "@/types/dream";
import { format, parseISO } from "date-fns";
import { Calendar, Moon, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleStarDream, deleteDream } from "@/utils/dreamStorage";
import { cn } from "@/lib/utils";

interface DreamCardProps {
  dream: Dream;
  onUpdate: () => void;
}

const DreamCard = ({ dream, onUpdate }: DreamCardProps) => {
  const { id, title, description, date, mood, type, isStarred } = dream;
  
  const formattedDate = format(parseISO(date), "MMM d, yyyy");
  
  const handleToggleStar = () => {
    toggleStarDream(id);
    onUpdate();
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this dream?")) {
      deleteDream(id);
      onUpdate();
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy": return "bg-green-100 text-green-800 border-green-200";
      case "sad": return "bg-blue-100 text-blue-800 border-blue-200";
      case "scared": return "bg-red-100 text-red-800 border-red-200";
      case "confused": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "peaceful": return "bg-dream-soft-blue text-dream-blue border-dream-blue/20";
      case "excited": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "lucid": return "bg-dream-light-purple/20 text-dream-deep-purple border-dream-light-purple/30";
      case "nightmare": return "bg-red-100 text-red-800 border-red-200";
      case "recurring": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className={cn(
      "border border-dream-light-purple/20 overflow-hidden transition-all duration-200 hover:shadow-md",
      isStarred ? "bg-dream-light-purple/10" : "bg-white/50 backdrop-blur-sm"
    )}>
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-amber-400"
          onClick={handleToggleStar}
        >
          <Star className={cn("h-5 w-5", isStarred && "fill-current")} />
        </Button>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <p className="text-sm text-foreground/90 line-clamp-3 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getMoodColor(mood)}>
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </Badge>
          <Badge variant="outline" className={getTypeColor(type)}>
            {type === "lucid" ? "Lucid Dream" : 
              type === "nightmare" ? "Nightmare" : 
              type === "recurring" ? "Recurring" : "Normal Dream"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive/70 hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DreamCard;
