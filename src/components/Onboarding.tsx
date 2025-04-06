
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, BookOpen, Calendar, PieChart, Settings } from "lucide-react";

const Onboarding = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if user has seen onboarding
    const onboardingComplete = localStorage.getItem("dream-whisperer-onboarding-complete");
    if (!onboardingComplete) {
      setOpen(true);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem("dream-whisperer-onboarding-complete", "true");
    setHasSeenOnboarding(true);
    setOpen(false);
  };
  
  const steps = [
    {
      title: "Welcome to Dream Whisperer",
      description: "Your personal dream journal to record, analyze, and understand your dreams.",
      content: (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="bg-dream-gradient w-16 h-16 rounded-full flex items-center justify-center">
            <Moon className="text-white h-8 w-8" />
          </div>
          <p className="text-center">
            Dream Whisperer helps you remember your dreams, find patterns, and discover insights about your subconscious mind.
          </p>
        </div>
      )
    },
    {
      title: "Record Your Dreams",
      description: "Capture your dreams before they fade from memory.",
      content: (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="bg-dream-light-purple/20 w-16 h-16 rounded-full flex items-center justify-center">
            <BookOpen className="text-dream-purple h-8 w-8" />
          </div>
          <p className="text-center">
            Use the journal to log your dreams with details like mood, type, and category. Add tags to help track recurring themes.
          </p>
        </div>
      )
    },
    {
      title: "Track Patterns Over Time",
      description: "View your dreams on a calendar to spot patterns.",
      content: (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="bg-dream-light-purple/20 w-16 h-16 rounded-full flex items-center justify-center">
            <Calendar className="text-dream-purple h-8 w-8" />
          </div>
          <p className="text-center">
            The calendar view shows when you've logged dreams. Set reminders to help you record your dreams consistently.
          </p>
        </div>
      )
    },
    {
      title: "Analyze Your Dream Data",
      description: "Discover patterns in your dreams with statistics.",
      content: (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="bg-dream-light-purple/20 w-16 h-16 rounded-full flex items-center justify-center">
            <PieChart className="text-dream-purple h-8 w-8" />
          </div>
          <p className="text-center">
            See charts of your dream moods, types, and frequencies to understand your dream patterns better.
          </p>
        </div>
      )
    },
    {
      title: "Get Started",
      description: "Begin your dream journaling journey.",
      content: (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="bg-dream-gradient w-16 h-16 rounded-full flex items-center justify-center">
            <Settings className="text-white h-8 w-8" />
          </div>
          <p className="text-center">
            Click "Start Journaling" to begin recording your dreams. You can access this tutorial again from the settings page.
          </p>
        </div>
      )
    }
  ];
  
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const resetOnboarding = () => {
    localStorage.removeItem("dream-whisperer-onboarding-complete");
    setHasSeenOnboarding(false);
    setStep(0);
    setOpen(true);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{steps[step].title}</DialogTitle>
            <DialogDescription>{steps[step].description}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">{steps[step].content}</div>
          
          <div className="flex justify-center gap-2 my-2">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === step ? 'bg-dream-purple' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="border-dream-light-purple/30"
            >
              Back
            </Button>
            <Button onClick={nextStep} className="bg-dream-gradient hover:opacity-90">
              {step === steps.length - 1 ? "Start Journaling" : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Button to reset onboarding (add to settings page) */}
      {hasSeenOnboarding && (
        <Button 
          variant="outline" 
          onClick={resetOnboarding}
          className="border-dream-light-purple/30 text-xs mt-4"
        >
          Show Onboarding Again
        </Button>
      )}
    </>
  );
};

export default Onboarding;
