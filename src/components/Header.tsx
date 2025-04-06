
import { Moon, Star } from "lucide-react";
import MusicPlayer from "./MusicPlayer";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full pb-6">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Moon className="text-dream-purple h-8 w-8" />
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-dream-purple`}>Dream Whisperer</h1>
        </div>
        <div className="flex items-center gap-3">
          <MusicPlayer />
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star} 
                className="h-4 w-4 text-dream-light-purple animate-twinkle" 
                style={{ animationDelay: `${star * 0.5}s` }}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
