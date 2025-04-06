
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={theme}>
      <div className="background-pattern"></div>
      <div className="min-h-screen">
        <div className="container py-8 px-4 max-w-6xl relative z-10">
          <div className="flex items-center justify-between">
            <Header />
            <Navigation />
          </div>
          <main className="pt-4 pb-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
