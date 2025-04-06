
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamImageProps {
  imageUrl: string;
  className?: string;
}

const DreamImage = ({ imageUrl, className }: DreamImageProps) => {
  if (!imageUrl) return null;
  
  return (
    <Card className={cn("border border-dream-light-purple/30 bg-white/70 backdrop-blur-sm overflow-hidden", className)}>
      <CardHeader className="bg-dream-purple/10 text-dream-deep-purple rounded-t-lg pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Image className="h-5 w-5" />
          Dream Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <img 
          src={imageUrl} 
          alt="AI interpretation of dream" 
          className="w-full h-auto rounded-md object-cover"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center italic">
          AI-generated visualization based on your dream description
        </p>
      </CardContent>
    </Card>
  );
};

export default DreamImage;
