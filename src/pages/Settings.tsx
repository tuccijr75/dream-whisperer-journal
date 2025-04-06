
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Moon, Bell, Share, Paintbrush, Mail } from "lucide-react";
import DreamReminder from "@/components/DreamReminder";
import { getDreams } from "@/utils/dreamStorage";
import ExportDreams from "@/components/ExportDreams";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "@/contexts/ThemeContext";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSoundEffects, setEnableSoundEffects] = useState(true);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const navigate = useNavigate();
  const dreams = getDreams();

  // Sync the theme toggle with the actual theme
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: EmailFormValues) => {
    toast({
      title: "Email Subscribed",
      description: `You've been subscribed with ${data.email}`,
    });
    form.reset();
  };

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    toggleTheme();
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem("dream-whisperer-onboarding-complete");
    toast({
      title: "Onboarding Reset",
      description: "You'll see the onboarding guide when you return to the home page.",
    });
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white dream-text">Settings</h2>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
            <CardHeader>
              <CardTitle>Email Newsletter</CardTitle>
              <CardDescription>Receive tips and inspiration for dream journaling.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input 
                              placeholder="Enter your email" 
                              type="email" 
                              {...field} 
                              className="border-dream-light-purple/30"
                            />
                          </FormControl>
                          <Button 
                            type="submit" 
                            className="bg-dream-gradient hover:opacity-90"
                          >
                            Subscribe
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>Manage how the app works for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Onboarding</Label>
                  <p className="text-sm text-muted-foreground">
                    See the onboarding tutorial again
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleResetOnboarding}
                  className="border-dream-light-purple/30"
                >
                  Show Onboarding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
            <CardHeader>
              <CardTitle>Display</CardTitle>
              <CardDescription>Customize how Dream Whisperer looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for better night viewing
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders to record your dreams
                  </p>
                </div>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when notifications arrive
                  </p>
                </div>
                <Switch
                  checked={enableSoundEffects}
                  onCheckedChange={setEnableSoundEffects}
                />
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Dream Reminders</h3>
                <DreamReminder />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm border-dream-light-purple/30">
            <CardHeader>
              <CardTitle>Export Your Dream Journal</CardTitle>
              <CardDescription>Save a backup of your dreams or transfer to another device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                You currently have {dreams.length} dream{dreams.length !== 1 ? 's' : ''} in your journal.
              </p>
              
              <div className="flex justify-center mt-4">
                <ExportDreams dreams={dreams} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
