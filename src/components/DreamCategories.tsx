
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dream, DreamCategory } from "@/types/dream";
import { getDreamsByCategory } from "@/utils/dreamStorage";
import { cn } from "@/lib/utils";

interface DreamCategoriesProps {
  onCategorySelect: (category: DreamCategory | 'all') => void;
  selectedCategory: DreamCategory | 'all';
  dreams: Dream[];
}

const DreamCategories = ({ onCategorySelect, selectedCategory, dreams }: DreamCategoriesProps) => {
  const categories: { id: DreamCategory | 'all', label: string }[] = [
    { id: 'all', label: 'All Dreams' },
    { id: 'personal', label: 'Personal' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'childhood', label: 'Childhood' },
    { id: 'spiritual', label: 'Spiritual' },
    { id: 'premonition', label: 'Premonition' },
    { id: 'uncategorized', label: 'Uncategorized' },
  ];

  // Count dreams in each category
  const getCategoryCount = (category: DreamCategory | 'all'): number => {
    if (category === 'all') {
      return dreams.length;
    }
    return dreams.filter(dream => dream.category === category).length;
  };

  return (
    <Card className="border border-dream-light-purple/30 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-dream-deep-purple">Categories</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              className={cn(
                "border-dream-light-purple/30 hover:bg-dream-purple/10 transition-colors",
                selectedCategory === category.id && "bg-dream-purple/20 border-dream-purple/50"
              )}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.label}
              <Badge 
                variant="secondary" 
                className="ml-2 bg-dream-light-purple/20 text-dream-deep-purple"
              >
                {getCategoryCount(category.id)}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DreamCategories;
