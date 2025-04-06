
import React, { useState, useEffect } from "react";
import { Dream } from "@/types/dream";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";

interface SearchSuggestionsProps {
  dreams: Dream[];
  onSelect: (query: string) => void;
}

const SearchSuggestions = ({ dreams, onSelect }: SearchSuggestionsProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // Extract unique words from dream titles and descriptions
  const extractSearchTerms = () => {
    const terms = new Set<string>();
    
    dreams.forEach(dream => {
      // Add title words
      dream.title.split(/\s+/).forEach(word => {
        if (word.length > 3) terms.add(word.toLowerCase());
      });
      
      // Add words from first 100 chars of description
      const shortDesc = dream.description.substring(0, 100);
      shortDesc.split(/\s+/).forEach(word => {
        if (word.length > 3) terms.add(word.toLowerCase());
      });
      
      // Add tags
      if (dream.tags) {
        dream.tags.forEach(tag => terms.add(tag.toLowerCase()));
      }
    });
    
    return Array.from(terms).sort();
  };
  
  const searchTerms = extractSearchTerms();
  
  const filteredTerms = inputValue === "" 
    ? [] 
    : searchTerms.filter(term => term.includes(inputValue.toLowerCase()));
  
  return (
    <Command className="rounded-lg border shadow-md relative border-dream-light-purple/30">
      <div className="flex items-center border-b px-3 bg-white/40 rounded-t-lg">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Search dreams..."
          value={inputValue}
          onValueChange={setInputValue}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="flex h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {open && filteredTerms.length > 0 && (
        <CommandList className="absolute w-full bg-white z-10 rounded-b-lg shadow-lg max-h-52">
          {filteredTerms.length === 0 && (
            <CommandEmpty>No suggestions found.</CommandEmpty>
          )}
          <CommandGroup heading="Suggestions">
            {filteredTerms.slice(0, 5).map((term) => (
              <CommandItem
                key={term}
                onSelect={() => {
                  onSelect(term);
                  setInputValue(term);
                  setOpen(false);
                }}
              >
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
};

export default SearchSuggestions;
