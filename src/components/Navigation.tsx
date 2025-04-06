
import { Link, useLocation } from "react-router-dom";
import { CalendarDays, BarChart3, Moon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      path: "/",
      label: "Journal",
      icon: <Moon className="h-4 w-4" />,
    },
    {
      path: "/calendar",
      label: "Calendar",
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      path: "/statistics",
      label: "Insights",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      path: "/meditation",
      label: "Sleep",
      icon: <Moon className="h-4 w-4" />,
    },
  ];

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#f0e6cf]">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {navigationItems.map((item) => (
            <DropdownMenuItem key={item.path} asChild>
              <Link
                to={item.path}
                className={`flex items-center gap-2 w-full ${
                  isActive(item.path) ? "bg-dream-light-purple/20" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <nav className="flex items-center gap-2">
      {navigationItems.map((item) => (
        <Link key={item.path} to={item.path}>
          <Button
            variant="ghost"
            className={`text-[#f0e6cf] hover:bg-dream-light-purple/20 ${
              isActive(item.path) ? "bg-dream-light-purple/20" : ""
            }`}
            size="sm"
          >
            {item.icon}
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
