import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import pptIcon from "@/assets/ppt-icon.png";
import imageIcon from "@/assets/image-icon.png";
import bgRemoverIcon from "@/assets/bg-remover-icon.png";

const Index = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "AI PPT Generator",
      description: "Create professional presentations in seconds with AI",
      icon: pptIcon,
      path: "/ppt-generator",
      glowClass: "glow-primary"
    },
    {
      title: "AI Image Generator",
      description: "Generate stunning images from text descriptions",
      icon: imageIcon,
      path: "/image-generator",
      glowClass: "glow-secondary"
    },
    {
      title: "Background Remover",
      description: "Remove backgrounds from images instantly",
      icon: bgRemoverIcon,
      path: "/background-remover",
      glowClass: "glow-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Dark AI Background */}
      <div 
        className="relative overflow-hidden py-24 px-4"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Multiple AI Tools
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto">
            Create presentations, generate images, and remove backgrounds with the power of AI
          </p>
        </div>
      </div>

      {/* Tools Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Choose Your <span className="text-gradient">AI Tool</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <Card 
              key={tool.path} 
              className={`cursor-pointer bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:${tool.glowClass}`}
              onClick={() => navigate(tool.path)}
            >
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden">
                  <img 
                    src={tool.icon} 
                    alt={tool.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl text-foreground">{tool.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              Multiple AI Tools - Powered by AI
            </p>
            <p className="text-muted-foreground/80 font-light tracking-wide">
              Created by <span className="font-semibold text-gradient">Ziyad</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
