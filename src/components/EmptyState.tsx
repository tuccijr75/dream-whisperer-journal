
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddDream: () => void;
}

const EmptyState = ({ onAddDream }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-dream-light-purple/10 p-6 rounded-full mb-6">
        <Moon className="h-12 w-12 text-dream-purple animate-float" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No dreams recorded yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start capturing your dreams to unlock insights into your subconscious mind.
      </p>
      <Button 
        onClick={onAddDream}
        className="bg-dream-gradient hover:opacity-90 transition-opacity"
      >
        Record Your First Dream
      </Button>
    </div>
  );
};

export default EmptyState;
