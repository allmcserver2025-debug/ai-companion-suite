import { Hero } from "@/components/Hero";
import { PresentationForm } from "@/components/PresentationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PptGenerator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>
      </div>
      
      <Hero />
      <PresentationForm />
      
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              AI-PPT Creator - Create professional presentations in seconds with AI
            </p>
            <p className="text-muted-foreground/80 font-light tracking-wide">
              Created by <span className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Ziyad</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PptGenerator;
