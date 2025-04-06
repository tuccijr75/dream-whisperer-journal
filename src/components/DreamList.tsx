
import { useState, useMemo } from "react";
import { Dream, DreamMood, DreamType, DreamCategory } from "@/types/dream";
import DreamCard from "./DreamCard";
import DreamCategories from "./DreamCategories";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, Filter, Tag, X } from "lucide-react";
import { format, parseISO, isSameMonth, isAfter, isBefore, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";

interface DreamListProps {
  dreams: Dream[];
  onUpdate: () => void;
}

const DreamList = ({ dreams, onUpdate }: DreamListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<DreamMood | "all">("all");
  const [typeFilter, setTypeFilter] = useState<DreamType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<DreamCategory | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("");
  
  // Get all unique tags from dreams
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    dreams.forEach(dream => {
      if (dream.tags) {
        dream.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [dreams]);
  
  const filteredDreams = useMemo(() => {
    if (!searchQuery.trim() && moodFilter === "all" && typeFilter === "all" && categoryFilter === "all" && !dateRange.from && !tagFilter) {
      return dreams;
    }
    
    return dreams.filter(dream => {
      // Text search filter
      const matchesSearch = !searchQuery.trim() || 
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dream.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Mood filter
      const matchesMood = moodFilter === "all" || dream.mood === moodFilter;
      
      // Type filter
      const matchesType = typeFilter === "all" || dream.type === typeFilter;
      
      // Category filter
      const matchesCategory = categoryFilter === "all" || dream.category === categoryFilter;
      
      // Date range filter
      let matchesDate = true;
      if (dateRange.from) {
        const dreamDate = new Date(dream.date);
        if (dateRange.to) {
          // Check if dream date is within range
          matchesDate = 
            (isAfter(dreamDate, dateRange.from) || isSameDay(dreamDate, dateRange.from)) && 
            (isBefore(dreamDate, dateRange.to) || isSameDay(dreamDate, dateRange.to));
        } else {
          // Only from date is set
          matchesDate = isSameDay(dreamDate, dateRange.from);
        }
      }
      
      // Tag filter
      const matchesTag = !tagFilter || 
        (dream.tags && dream.tags.some(tag => tag.toLowerCase() === tagFilter.toLowerCase()));
      
      return matchesSearch && matchesMood && matchesType && matchesCategory && matchesDate && matchesTag;
    });
  }, [dreams, searchQuery, moodFilter, typeFilter, categoryFilter, dateRange, tagFilter]);
  
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

  const resetFilters = () => {
    setMoodFilter("all");
    setTypeFilter("all");
    setCategoryFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setTagFilter("");
  };

  const hasActiveFilters = moodFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all" || !!dateRange.from || !!tagFilter;

  return (
    <div className="space-y-6">
      <DreamCategories 
        onCategorySelect={setCategoryFilter} 
        selectedCategory={categoryFilter} 
        dreams={dreams}
      />
      
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-dream-light-purple/30 focus:border-dream-purple"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-dream-light-purple/30"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4" />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-dream-light-purple/20">
            <div className="space-y-2">
              <Label htmlFor="mood-filter">Mood</Label>
              <Select value={moodFilter} onValueChange={(value) => setMoodFilter(value as DreamMood | "all")}>
                <SelectTrigger className="border-dream-light-purple/30" id="mood-filter">
                  <SelectValue placeholder="Filter by mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moods</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="scared">Scared</SelectItem>
                  <SelectItem value="confused">Confused</SelectItem>
                  <SelectItem value="peaceful">Peaceful</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type-filter">Dream Type</Label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DreamType | "all")}>
                <SelectTrigger className="border-dream-light-purple/30" id="type-filter">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="normal">Normal Dream</SelectItem>
                  <SelectItem value="lucid">Lucid Dream</SelectItem>
                  <SelectItem value="nightmare">Nightmare</SelectItem>
                  <SelectItem value="recurring">Recurring Dream</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-dream-light-purple/30",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag-filter">Tag</Label>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="border-dream-light-purple/30" id="tag-filter">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {moodFilter !== "all" && (
              <Badge className="bg-dream-light-purple/30 hover:bg-dream-light-purple/50" variant="secondary">
                Mood: {moodFilter}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setMoodFilter("all")} />
              </Badge>
            )}
            {typeFilter !== "all" && (
              <Badge className="bg-dream-light-purple/30 hover:bg-dream-light-purple/50" variant="secondary">
                Type: {typeFilter}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setTypeFilter("all")} />
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge className="bg-dream-light-purple/30 hover:bg-dream-light-purple/50" variant="secondary">
                Category: {categoryFilter}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setCategoryFilter("all")} />
              </Badge>
            )}
            {dateRange.from && (
              <Badge className="bg-dream-light-purple/30 hover:bg-dream-light-purple/50" variant="secondary">
                Date: {format(dateRange.from, "LLL dd")}
                {dateRange.to && ` - ${format(dateRange.to, "LLL dd")}`}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setDateRange({from: undefined, to: undefined})} 
                />
              </Badge>
            )}
            {tagFilter && (
              <Badge className="bg-dream-light-purple/30 hover:bg-dream-light-purple/50" variant="secondary">
                Tag: {tagFilter}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setTagFilter("")} />
              </Badge>
            )}
          </div>
        )}
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
