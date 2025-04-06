
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDreamById } from "@/utils/dreamStorage";
import { Dream } from "@/types/dream";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import DreamImage from "@/components/DreamImage";
import DreamInterpretation from "@/components/DreamInterpretation";
import { cn } from "@/lib/utils";

const SharedDream = () => {
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<Dream | null>(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundDream = getDreamById(id);
      if (foundDream && foundDream.isPublic) {
        setDream(foundDream);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  const getMoodEmoji = (mood: string): string => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "scared": return "😨";
      case "confused": return "😕";
      case "peaceful": return "😌";
      case "excited": return "😃";
      default: return "😐";
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Dream Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          This dream doesn't exist or is not shared publicly.
        </p>
        <Button onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="flex justify-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={handleBackClick}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>

      <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-dream-gradient text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{dream.title}</CardTitle>
            <Badge className="bg-white/20">Shared Dream</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          {dream.imageUrl && (
            <div className="mb-6">
              <DreamImage imageUrl={dream.imageUrl} />
            </div>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{format(parseISO(dream.date), "MMMM d, yyyy")}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-dream-light-purple/30">
                {dream.type}
              </Badge>
              <Badge 
                className={cn(
                  "border-dream-light-purple/30",
                  dream.mood === "happy" && "bg-green-50 text-green-700",
                  dream.mood === "sad" && "bg-blue-50 text-blue-700",
                  dream.mood === "scared" && "bg-red-50 text-red-700",
                  dream.mood === "confused" && "bg-orange-50 text-orange-700",
                  dream.mood === "peaceful" && "bg-purple-50 text-purple-700",
                  dream.mood === "excited" && "bg-yellow-50 text-yellow-700",
                )}
              >
                {getMoodEmoji(dream.mood)} {dream.mood}
              </Badge>
              
              <Badge className="bg-dream-light-purple/20 text-dream-deep-purple">
                {dream.category}
              </Badge>
            </div>
          </div>
          
          <div className="py-2">
            <p className="whitespace-pre-line">{dream.description}</p>
          </div>
          
          {dream.tags && dream.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {dream.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-dream-light-purple/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {dream.interpretation && (
            <div className="pt-4">
              <DreamInterpretation interpretation={dream.interpretation} />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-dream-light-purple/20 pt-4">
          <p className="text-sm text-muted-foreground">
            This dream was shared with Dream Whisperer
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SharedDream;
