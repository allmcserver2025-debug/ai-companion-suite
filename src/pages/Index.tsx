import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Wand2 } from "lucide-react";
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
      glowClass: "glow-primary",
      accentIcon: Sparkles,
      delay: "animate-slide-up-delay-1"
    },
    {
      title: "AI Image Generator",
      description: "Generate stunning images from text descriptions",
      icon: imageIcon,
      path: "/image-generator",
      glowClass: "glow-secondary",
      accentIcon: Wand2,
      delay: "animate-slide-up-delay-2"
    },
    {
      title: "Background Remover",
      description: "Remove backgrounds from images instantly",
      icon: bgRemoverIcon,
      path: "/background-remover",
      glowClass: "glow-accent",
      accentIcon: Zap,
      delay: "animate-slide-up-delay-3"
    }
  ];

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 15}s`,
    size: Math.random() * 4 + 2,
    color: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Floating Particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color
            }}
          />
        ))}
      </div>

      {/* Hero Section with Dark AI Background */}
      <div 
        className="relative overflow-hidden py-24 px-4"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse-glow opacity-50" />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-border/50 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm font-medium text-foreground">AI-Powered Creative Suite</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-slide-up-delay-1">
            Multiple AI Tools
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto animate-slide-up-delay-2">
            Create presentations, generate images, and remove backgrounds with the power of AI
          </p>

          {/* Animated scroll indicator */}
          <div className="mt-12 animate-slide-up-delay-3">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full mx-auto relative">
              <div className="w-1.5 h-3 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 top-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="container mx-auto px-4 py-16 relative">
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground animate-slide-up">
          Choose Your <span className="text-gradient">AI Tool</span>
        </h2>
        
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto animate-slide-up-delay-1">
          Powerful AI tools designed to boost your creativity and productivity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const AccentIcon = tool.accentIcon;
            return (
              <Card 
                key={tool.path} 
                className={`cursor-pointer bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 group card-3d ${tool.delay}`}
                onClick={() => navigate(tool.path)}
              >
                <CardHeader className="text-center relative">
                  {/* Floating accent icon */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <AccentIcon className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden animate-float group-hover:animate-pulse-glow transition-all duration-300`}>
                    <img 
                      src={tool.icon} 
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardTitle className="text-2xl text-foreground group-hover:text-gradient transition-all duration-300">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground relative overflow-hidden group/btn">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Zap, label: "Lightning Fast", desc: "Results in seconds" },
            { icon: Sparkles, label: "AI Powered", desc: "State-of-the-art models" },
            { icon: Wand2, label: "Easy to Use", desc: "No expertise needed" }
          ].map((feature, i) => (
            <div 
              key={feature.label}
              className={`flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up-delay-${i + 1}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{feature.label}</p>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
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