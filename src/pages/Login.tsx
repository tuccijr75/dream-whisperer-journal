
import { Moon, Star } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { useTheme } from "@/contexts/ThemeContext";

const Login = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme} min-h-screen flex flex-col items-center justify-center`}>
      <div className="background-pattern"></div>
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Moon className="text-[#f0e6cf] h-8 w-8" />
            <h1 className="text-2xl font-bold text-[#f0e6cf] dream-text">Dream Whisperer</h1>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star} 
                className="h-4 w-4 text-[#f0e6cf] animate-twinkle" 
                style={{ animationDelay: `${star * 0.5}s` }}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
        
        <LoginForm />
        
        <div className="mt-8 text-center text-[#f0e6cf]/60 text-sm">
          <p>Dream Whisperer &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
