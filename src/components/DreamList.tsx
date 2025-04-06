
import { useState, useMemo } from "react";
import { Dream } from "@/types/dream";
import DreamCard from "./DreamCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { format, parseISO, isSameMonth } from "date-fns";

interface DreamListProps {
  dreams: Dream[];
  onUpdate: () => void;
}

const DreamList = ({ dreams, onUpdate }: DreamListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDreams = useMemo(() => {
    if (!searchQuery.trim()) return dreams;
    
    const query = searchQuery.toLowerCase();
    return dreams.filter(
      dream => 
        dream.title.toLowerCase().includes(query) || 
        dream.description.toLowerCase().includes(query)
    );
  }, [dreams, searchQuery]);

  // Group dreams by month
  const groupedDreams = useMemo(() => {
    const groups: Record<string, Dream[]> = {};
    
    filteredDreams.forEach(dream => {
      const date = parseISO(dream.date);
      const monthKey = format(date, "MMMM yyyy");
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      
      groups[monthKey].push(dream);
    });
    
    // Sort each group by date (newest first)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
    
    return groups;
  }, [filteredDreams]);

  // Get sorted month keys (newest first)
  const sortedMonthKeys = useMemo(() => {
    return Object.keys(groupedDreams).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedDreams]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search your dreams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-dream-light-purple/30 focus:border-dream-purple"
        />
      </div>
      
      {filteredDreams.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No dreams match your search</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedMonthKeys.map(monthKey => (
            <div key={monthKey} className="space-y-3">
              <h2 className="font-semibold text-lg text-dream-deep-purple">{monthKey}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedDreams[monthKey].map(dream => (
                  <DreamCard 
                    key={dream.id} 
                    dream={dream}
                    onUpdate={onUpdate}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DreamList;
