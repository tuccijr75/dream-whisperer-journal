
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamInterpretationProps {
  interpretation: string;
  className?: string;
}

const DreamInterpretation = ({ interpretation, className }: DreamInterpretationProps) => {
  if (!interpretation) return null;
  
  // Split the interpretation into paragraphs
  const paragraphs = interpretation.split('\n\n');
  
  return (
    <Card className={cn("border border-dream-light-purple/30 bg-white/70 backdrop-blur-sm", className)}>
      <CardHeader className="bg-dream-purple/10 text-dream-deep-purple rounded-t-lg pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5" />
          Dream Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {paragraphs.map((paragraph, index) => {
          // Check if this is a bullet point list
          if (paragraph.includes('\n•')) {
            const [title, ...listItems] = paragraph.split('\n');
            return (
              <div key={index} className="space-y-2">
                <p className="font-medium">{title}</p>
                <ul className="space-y-1 list-disc pl-5">
                  {listItems.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{item.substring(1).trim()}</li>
                  ))}
                </ul>
              </div>
            );
          }
          
          return (
            <p key={index} className="text-sm text-muted-foreground leading-relaxed">{paragraph}</p>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DreamInterpretation;
