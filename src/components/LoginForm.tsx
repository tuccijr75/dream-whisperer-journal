
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // This is where you would typically handle authentication
    console.log("Login submitted:", values);
    
    // For now, just simulate a successful login
    toast({
      title: "Login successful",
      description: "Welcome back to Dream Whisperer!",
    });
    
    // Navigate to the home page after successful login
    setTimeout(() => navigate("/"), 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#f0e6cf] dream-text">Welcome Back</CardTitle>
        <CardDescription className="text-[#f0e6cf]/80">
          Enter your credentials to access your dream journal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f0e6cf]">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      className="bg-black/30 border-white/20 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#f0e6cf]">Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        className="bg-black/30 border-white/20 text-white pr-10" 
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-[#f0e6cf]"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-dream-gradient hover:opacity-90 transition-opacity"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-[#f0e6cf]/70 text-center">
          Don't have an account?{" "}
          <a 
            href="#" 
            className="text-[#f0e6cf] hover:underline"
            onClick={(e) => { 
              e.preventDefault(); 
              toast({
                title: "Registration Coming Soon",
                description: "Sign up functionality will be available in the next update.",
              });
            }}
          >
            Create account
          </a>
        </div>
        <div className="text-xs text-[#f0e6cf]/50 text-center">
          <a 
            href="#" 
            className="hover:underline"
            onClick={(e) => { 
              e.preventDefault(); 
              toast({
                title: "Reset Password Coming Soon",
                description: "Password reset functionality will be available in the next update.",
              });
            }}
          >
            Forgot your password?
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
