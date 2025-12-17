import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Wand2, ArrowRight } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import pptIcon from "@/assets/ppt-icon.png";
import imageIcon from "@/assets/image-icon.png";
import bgRemoverIcon from "@/assets/bg-remover-icon.png";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const tools = [
    {
      title: "AI PPT Generator",
      description: "Create professional presentations in seconds with AI",
      icon: pptIcon,
      path: "/ppt-generator",
      gradient: "from-purple-500 to-pink-500",
      accentIcon: Sparkles,
    },
    {
      title: "AI Image Generator",
      description: "Generate stunning images from text descriptions",
      icon: imageIcon,
      path: "/image-generator",
      gradient: "from-cyan-500 to-blue-500",
      accentIcon: Wand2,
    },
    {
      title: "Background Remover",
      description: "Remove backgrounds from images instantly",
      icon: bgRemoverIcon,
      path: "/background-remover",
      gradient: "from-pink-500 to-orange-500",
      accentIcon: Zap,
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Interactive Particle Background */}
      <ParticleBackground />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Animated Badge */}
          <div 
            className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-primary/30 animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-sm font-medium text-foreground">AI-Powered Creative Suite</span>
          </div>
          
          {/* Main Title with Glow Effect */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
            <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_3s_ease_infinite]">
              Multiple AI Tools
            </span>
            {/* Glow behind text */}
            <span className="absolute inset-0 text-6xl md:text-8xl font-bold text-primary/20 blur-2xl -z-10">
              Multiple AI Tools
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create presentations, generate images, and remove backgrounds with the power of AI
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Tools
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {/* Scroll Indicator */}
          <div className="mt-16">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full mx-auto relative">
              <div className="w-1.5 h-3 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 top-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div id="tools" className="relative z-10 container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
          Choose Your <span className="text-gradient">AI Tool</span>
        </h2>
        
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Powerful AI tools designed to boost your creativity and productivity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const AccentIcon = tool.accentIcon;
            const isHovered = hoveredCard === tool.path;
            
            return (
              <Card 
                key={tool.path} 
                className={`cursor-pointer bg-card/60 backdrop-blur-xl border-border relative overflow-hidden transition-all duration-500 group ${
                  isHovered ? "scale-105 border-primary/50 shadow-[0_0_40px_rgba(168,85,247,0.3)]" : ""
                }`}
                onClick={() => navigate(tool.path)}
                onMouseEnter={() => setHoveredCard(tool.path)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <CardHeader className="text-center relative z-10">
                  {/* Floating accent icon */}
                  <div className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                    <AccentIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <div className={`w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden transition-all duration-500 ${isHovered ? "scale-110 shadow-[0_0_30px_rgba(168,85,247,0.4)]" : ""}`}>
                    <img 
                      src={tool.icon} 
                      alt={tool.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className={`text-2xl transition-all duration-300 ${isHovered ? "text-gradient" : "text-foreground"}`}>
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-primary-foreground transition-all duration-300 ${isHovered ? "shadow-lg" : ""}`}>
                    Get Started
                    <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Zap, label: "Lightning Fast", desc: "Results in seconds", gradient: "from-yellow-500 to-orange-500" },
            { icon: Sparkles, label: "AI Powered", desc: "State-of-the-art models", gradient: "from-purple-500 to-pink-500" },
            { icon: Wand2, label: "Easy to Use", desc: "No expertise needed", gradient: "from-cyan-500 to-blue-500" }
          ].map((feature) => (
            <div 
              key={feature.label}
              className="flex items-center gap-4 p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{feature.label}</p>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-border py-8 mt-12 bg-card/30 backdrop-blur-sm">
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