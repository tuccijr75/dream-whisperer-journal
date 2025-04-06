
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
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
    </>
  );
};

export default Layout;
