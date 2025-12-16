import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ImagePlus, Eraser } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "AI PPT Generator",
      description: "Create professional presentations in seconds with AI",
      icon: FileText,
      path: "/ppt-generator",
      gradient: "from-primary to-primary/70"
    },
    {
      title: "AI Image Generator",
      description: "Generate stunning images from text descriptions",
      icon: ImagePlus,
      path: "/image-generator",
      gradient: "from-secondary to-secondary/70"
    },
    {
      title: "Background Remover",
      description: "Remove backgrounds from images instantly",
      icon: Eraser,
      path: "/background-remover",
      gradient: "from-accent to-accent/70"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI Creative Studio
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your AI-powered tool to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.path} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => navigate(tool.path)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{tool.title}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              AI Creative Studio - Powered by AI
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

export default Index;
