
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Dream } from "@/types/dream";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Star, Trash2, Brain, Image } from "lucide-react";
import { toggleStarDream, deleteDream } from "@/utils/dreamStorage";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DreamInterpretation from "./DreamInterpretation";
import DreamImage from "./DreamImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DreamCardProps {
  dream: Dream;
  onUpdate: () => void;
  fullWidth?: boolean;
}

const dreamTypeColors: Record<string, string> = {
  normal: "bg-blue-100 text-blue-800",
  lucid: "bg-purple-100 text-purple-800",
  nightmare: "bg-red-100 text-red-800",
  recurring: "bg-amber-100 text-amber-800",
};

const dreamMoodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  scared: "😨",
  confused: "😕", 
  peaceful: "😌",
  excited: "😃",
};

const DreamCard = ({ dream, onUpdate, fullWidth }: DreamCardProps) => {
  const { toast } = useToast();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const handleToggleStar = () => {
    toggleStarDream(dream.id);
    toast({
      title: dream.isStarred ? "Dream unmarked" : "Dream marked",
      description: dream.isStarred 
        ? "Dream removed from favorites" 
        : "Dream added to favorites",
    });
    onUpdate();
  };
  
  const handleDelete = () => {
    deleteDream(dream.id);
    toast({
      title: "Dream deleted",
      description: "Your dream has been removed permanently",
    });
    onUpdate();
  };

  const hasInsights = dream.interpretation || dream.imageUrl;
  
  return (
    <Card className={`border-dream-light-purple/30 bg-white/50 backdrop-blur-sm overflow-hidden hover:shadow-md transition-shadow ${fullWidth ? 'w-full' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{dream.title}</CardTitle>
            <CardDescription className="flex items-center text-xs mt-1">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {format(parseISO(dream.date), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            {hasInsights && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-dream-purple hover:text-dream-deep-purple">
                    {dream.interpretation && <Brain className="h-4 w-4" />}
                    {!dream.interpretation && dream.imageUrl && <Image className="h-4 w-4" />}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Dream Insights</DialogTitle>
                  </DialogHeader>
                  
                  {dream.interpretation && dream.imageUrl ? (
                    <Tabs defaultValue="analysis" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="analysis" className="flex items-center gap-1">
                          <Brain className="h-4 w-4" /> Analysis
                        </TabsTrigger>
                        <TabsTrigger value="visualization" className="flex items-center gap-1">
                          <Image className="h-4 w-4" /> Visualization
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="analysis" className="pt-4">
                        <DreamInterpretation interpretation={dream.interpretation} />
                      </TabsContent>
                      <TabsContent value="visualization" className="pt-4">
                        <DreamImage imageUrl={dream.imageUrl} />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <>
                      {dream.interpretation && <DreamInterpretation interpretation={dream.interpretation} />}
                      {dream.imageUrl && <DreamImage imageUrl={dream.imageUrl} />}
                    </>
                  )}
                </DialogContent>
              </Dialog>
            )}
            <Button 
              size="icon" 
              variant="ghost" 
              className={`h-8 w-8 ${dream.isStarred ? "text-yellow-500" : "text-muted-foreground"}`}
              onClick={handleToggleStar}
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm line-clamp-3 text-muted-foreground">
          {dream.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${dreamTypeColors[dream.type] || ""}`}>
            {dream.type}
          </Badge>
          <span className="text-sm">{dreamMoodEmojis[dream.mood]}</span>
        </div>
        
        <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
          <DialogTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Delete Dream</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to delete this dream? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DreamCard;
