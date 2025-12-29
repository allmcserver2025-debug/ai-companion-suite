import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import PptxGenJS from "pptxgenjs";

interface PresentationData {
  title: string;
  slides: Array<{
    title: string;
    content: string[];
    speakerNotes: string;
    imageBase64?: string;
  }>;
}

export const PresentationForm = () => {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState("10");
  const [tone, setTone] = useState("informative");
  const [style, setStyle] = useState("corporate");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePresentation = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your presentation");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-presentation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic,
            slideCount: parseInt(slideCount),
            tone,
            style,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Payment required. Please add credits to your workspace.");
        }
        throw new Error(error.error || 'Failed to generate presentation');
      }

      const data: PresentationData = await response.json();
      
      await createPowerPoint(data);
      
      toast.success("Presentation generated successfully!");
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const createPowerPoint = async (data: PresentationData) => {
    const pptx = new PptxGenJS();
    
    pptx.author = "AI-PPT Creator";
    pptx.title = data.title;
    pptx.subject = topic;
    
    const colorSchemes: Record<string, { 
      bg: string; 
      bgGradient?: { color: string; transparency: number }[];
      primary: string; 
      secondary: string;
      accent: string;
      text: string;
      textLight: string;
      titleFont: string;
      bodyFont: string;
    }> = {
      corporate: { 
        bg: "1a1f36", 
        bgGradient: [{ color: "1a1f36", transparency: 0 }, { color: "2d3561", transparency: 0 }],
        primary: "6366F1", 
        secondary: "8B5CF6",
        accent: "EC4899",
        text: "F9FAFB",
        textLight: "D1D5DB",
        titleFont: "Montserrat",
        bodyFont: "Open Sans"
      },
      minimal: { 
        bg: "FFFFFF", 
        primary: "0F172A", 
        secondary: "475569",
        accent: "3B82F6",
        text: "1E293B",
        textLight: "64748B",
        titleFont: "Inter",
        bodyFont: "Inter"
      },
      ocean: { 
        bg: "0A192F", 
        bgGradient: [{ color: "0A192F", transparency: 0 }, { color: "112240", transparency: 0 }],
        primary: "64FFDA", 
        secondary: "00D9FF",
        accent: "5EEAD4",
        text: "E6F1FF",
        textLight: "8892B0",
        titleFont: "Raleway",
        bodyFont: "Roboto"
      },
      sunset: { 
        bg: "2D1B69", 
        bgGradient: [{ color: "2D1B69", transparency: 0 }, { color: "E94560", transparency: 0 }],
        primary: "FF6B6B", 
        secondary: "FFD93D",
        accent: "F78C6B",
        text: "FFFFFF",
        textLight: "FFC8DD",
        titleFont: "Playfair Display",
        bodyFont: "Merriweather"
      },
      forest: { 
        bg: "1B4332", 
        primary: "95D5B2", 
        secondary: "74C69D",
        accent: "D8F3DC",
        text: "F1FAEE",
        textLight: "B7E4C7",
        titleFont: "Libre Baskerville",
        bodyFont: "Source Sans Pro"
      },
      midnight: { 
        bg: "000000", 
        bgGradient: [{ color: "000000", transparency: 0 }, { color: "1A1A2E", transparency: 0 }],
        primary: "FF2E63", 
        secondary: "FF00FF",
        accent: "00FFF5",
        text: "EAEAEA",
        textLight: "A6A6A6",
        titleFont: "Orbitron",
        bodyFont: "Exo 2"
      },
      neon: { 
        bg: "0D0D0D", 
        primary: "00FF41", 
        secondary: "FF006E",
        accent: "00F5FF",
        text: "FFFFFF",
        textLight: "CCCCCC",
        titleFont: "Audiowide",
        bodyFont: "Chakra Petch"
      },
      royal: { 
        bg: "1C0A5E", 
        bgGradient: [{ color: "1C0A5E", transparency: 0 }, { color: "4A148C", transparency: 0 }],
        primary: "FFD700", 
        secondary: "FFA500",
        accent: "FF6347",
        text: "F8F8FF",
        textLight: "D4AF37",
        titleFont: "Cinzel",
        bodyFont: "Lora"
      },
    };
    
    const theme = colorSchemes[style] || colorSchemes.corporate;

    // Title Slide
    const titleSlide = pptx.addSlide();
    
    if (theme.bgGradient) {
      titleSlide.background = { fill: theme.bgGradient[0].color };
    } else {
      titleSlide.background = { color: theme.bg };
    }
    
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: 2, w: 0.15, h: 3,
      fill: { color: theme.primary },
      line: { type: "none" }
    });
    
    titleSlide.addText(data.title, {
      x: 1,
      y: 2.2,
      w: 8,
      h: 2,
      fontSize: 54,
      bold: true,
      color: theme.text,
      align: "left",
      fontFace: theme.titleFont,
      valign: "middle"
    });
    
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 1, y: 4.3, w: 3, h: 0.08,
      fill: { color: theme.accent },
      line: { type: "none" }
    });

    // Content Slides
    data.slides.forEach((slideData, index) => {
      const slide = pptx.addSlide();
      
      if (theme.bgGradient && index % 2 === 0) {
        slide.background = { fill: theme.bgGradient[0].color };
      } else {
        slide.background = { color: theme.bg };
      }
      
      slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.15, h: "100%",
        fill: { color: theme.accent },
        line: { type: "none" }
      });
      
      const titleAccent = index % 3 === 0 ? theme.primary : index % 3 === 1 ? theme.secondary : theme.accent;
      slide.addText(slideData.title, {
        x: 0.5,
        y: 0.5,
        w: 8.5,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: theme.text,
        fontFace: theme.titleFont,
        valign: "top"
      });
      
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.5,
        w: 2,
        h: 0.05,
        fill: { color: titleAccent },
        line: { type: "none" }
      });
      
      // Determine layout based on whether we have an image
      const hasImage = slideData.imageBase64;
      const contentWidth = hasImage ? 5.5 : 7.8;
      const contentX = 1.0;
      
      slideData.content.forEach((point, pointIndex) => {
        const yPos = 2.0 + (pointIndex * 0.65);
        
        if (yPos < 5.2) {
          slide.addShape(pptx.ShapeType.ellipse, {
            x: 0.7, y: yPos + 0.1, w: 0.12, h: 0.12,
            fill: { color: titleAccent },
            line: { type: "none" }
          });
          
          slide.addText(point, {
            x: contentX,
            y: yPos,
            w: contentWidth,
            h: 0.55,
            fontSize: 16,
            color: theme.text,
            fontFace: theme.bodyFont,
            valign: "top"
          });
        }
      });
      
      // Add AI-generated image if available
      if (slideData.imageBase64) {
        try {
          slide.addImage({
            data: slideData.imageBase64,
            x: 6.8,
            y: 1.8,
            w: 2.8,
            h: 2.8,
            rounding: true
          });
        } catch (imgError) {
          console.error('Failed to add image to slide:', imgError);
        }
      }
      
      slide.addText(`${index + 1}`, {
        x: 9.2,
        y: 5.4,
        w: 0.5,
        h: 0.3,
        fontSize: 12,
        color: theme.textLight,
        align: "right",
        fontFace: theme.bodyFont,
      });
      
      if (slideData.speakerNotes) {
        slide.addNotes(slideData.speakerNotes);
      }
    });

    const fileName = `${data.title.replace(/[^a-z0-9]/gi, '_')}.pptx`;
    await pptx.writeFile({ fileName });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-lg font-semibold">
              What's your presentation about?
            </Label>
            <Textarea
              id="topic"
              placeholder="e.g., The Impact of Artificial Intelligence on Modern Healthcare, Digital Marketing Strategies for 2025, Climate Change Solutions..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[120px] text-base resize-none"
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slides" className="text-sm font-medium">
                Number of Slides
              </Label>
              <Select value={slideCount} onValueChange={setSlideCount} disabled={isGenerating}>
                <SelectTrigger id="slides">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 7, 10, 12, 15, 20, 30].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} slides
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm font-medium">
                Tone
              </Label>
              <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="fun">Fun & Engaging</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style" className="text-sm font-medium">
                Style
              </Label>
              <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="sunset">Sunset</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="midnight">Midnight</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="royal">Royal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generatePresentation}
            disabled={isGenerating}
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating your presentation...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Presentation
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Your presentation will be automatically downloaded as a .pptx file
          </p>
        </div>
      </div>
    </div>
  );
};
