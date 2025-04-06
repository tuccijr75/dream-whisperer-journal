
import { NavLink } from "react-router-dom";
import { Calendar, BarChart2, Home, Menu, X, Moon, Video, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
      isActive
        ? "bg-dream-purple/20 text-white font-medium"
        : "text-[#f0e6cf] hover:bg-white/5"
    );

  return (
    <div className="relative z-20">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-1">
        <NavLink to="/" className={getLinkClass}>
          <Home size={18} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/calendar" className={getLinkClass}>
          <Calendar size={18} />
          <span>Calendar</span>
        </NavLink>
        <NavLink to="/statistics" className={getLinkClass}>
          <BarChart2 size={18} />
          <span>Stats</span>
        </NavLink>
        <NavLink to="/meditation" className={getLinkClass}>
          <Video size={18} />
          <span>Meditation</span>
        </NavLink>
        <NavLink to="/settings" className={getLinkClass}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute right-0 top-12 w-60 bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 flex flex-col">
            <NavLink to="/" className={getLinkClass} onClick={closeMenu}>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/calendar" className={getLinkClass} onClick={closeMenu}>
              <Calendar size={18} />
              <span>Calendar</span>
            </NavLink>
            <NavLink to="/statistics" className={getLinkClass} onClick={closeMenu}>
              <BarChart2 size={18} />
              <span>Stats</span>
            </NavLink>
            <NavLink to="/meditation" className={getLinkClass} onClick={closeMenu}>
              <Video size={18} />
              <span>Meditation</span>
            </NavLink>
            <NavLink to="/settings" className={getLinkClass} onClick={closeMenu}>
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
