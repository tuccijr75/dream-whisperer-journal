
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, User, Bell, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);

  const handleThemeToggle = () => {
    toggleTheme();
    toast({
      title: `Theme changed to ${theme === "light" ? "dark" : "light"} mode`,
      description: "Your preference has been saved.",
    });
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    toast({
      title: `Notifications ${notifications ? "disabled" : "enabled"}`,
      description: "Your preference has been saved.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // In a real app, this would handle actual logout logic
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile saved",
      description: "Your profile changes have been saved.",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white dream-text mb-6">Settings</h1>

      <Card className="border border-white/10 bg-black/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white dream-text flex items-center gap-2">
            <User size={18} /> Profile Settings
          </CardTitle>
          <CardDescription className="text-[#f0e6cf]">
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#f0e6cf] mb-1 block">
                Display Name
              </label>
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" 
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#f0e6cf] mb-1 block">
                Email
              </label>
              <input 
                type="email" 
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" 
                placeholder="your.email@example.com"
                readOnly
              />
            </div>
          </div>
          <Button 
            onClick={handleSaveProfile}
            className="bg-dream-gradient hover:opacity-90 transition-opacity mt-2"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-black/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white dream-text">Appearance & Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {theme === "dark" ? <Moon className="text-[#9b87f5]" /> : <Sun className="text-[#f0e6cf]" />}
              <div>
                <h3 className="text-base font-medium text-white">Dark Mode</h3>
                <p className="text-sm text-[#f0e6cf]">Toggle between light and dark themes</p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeToggle}
              className="data-[state=checked]:bg-dream-purple"
            />
          </div>
          
          <Separator className="bg-white/10" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="text-[#9b87f5]" />
              <div>
                <h3 className="text-base font-medium text-white">Notifications</h3>
                <p className="text-sm text-[#f0e6cf]">Enable dream reminders and notifications</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationsToggle}
              className="data-[state=checked]:bg-dream-purple"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-black/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white dream-text">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="bg-red-500/70 hover:bg-red-600/70"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
