import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Wand2, Download, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ImageGenerator = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [style, setStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("standard");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating your image...");
    
    try {
      const stylePrompts: Record<string, string> = {
        realistic: "ultra realistic, photorealistic, high detail",
        artistic: "artistic style, creative interpretation, expressive",
        digital: "digital art, modern style, vibrant colors",
        oil: "oil painting style, classical art, brush strokes",
        watercolor: "watercolor painting, soft edges, artistic blend",
        anime: "anime style, manga art, Japanese animation",
        sketch: "pencil sketch, hand drawn, artistic lines",
        cinematic: "cinematic lighting, dramatic, movie-like quality"
      };

      const qualityPrompts: Record<string, string> = {
        standard: "",
        high: "high quality, detailed",
        ultra: "ultra high quality, masterpiece, 8k resolution, highly detailed"
      };

      const enhancedPrompt = `${prompt}, ${stylePrompts[style]}, ${qualityPrompts[quality]}, ${aspectRatio} aspect ratio`;
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: enhancedPrompt,
          style,
          aspectRatio,
          quality
        }
      });

      toast.dismiss(loadingToast);

      if (error) {
        console.error("Error generating image:", error);
        if (error.message?.includes('429')) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (error.message?.includes('402')) {
          toast.error("Payment required. Please add credits to your workspace.");
        } else {
          toast.error(error.message || "Failed to generate image");
        }
        return;
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Image generated successfully!");
      } else {
        toast.error("No image was generated");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

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

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg mb-4">
            <Wand2 className="w-12 h-12 text-secondary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Describe Your Image
              </CardTitle>
              <CardDescription>
                Enter a detailed description and customize the style, quality, and aspect ratio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="A beautiful sunset over mountains with vibrant colors, peaceful lake reflection..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="digital">Digital Art</SelectItem>
                      <SelectItem value="oil">Oil Painting</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspectRatio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">Square (1:1)</SelectItem>
                      <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      <SelectItem value="4:3">Standard (4:3)</SelectItem>
                      <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality</Label>
                  <RadioGroup value={quality} onValueChange={setQuality} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer">Standard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="font-normal cursor-pointer">High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ultra" id="ultra" />
                      <Label htmlFor="ultra" className="font-normal cursor-pointer">Ultra</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
            </CardContent>
          </Card>
          
          {generatedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDownload}
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                  <Button 
                    onClick={() => setGeneratedImage(null)}
                    variant="outline"
                    size="lg"
                  >
                    Generate New
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              AI Image Generator - Create stunning visuals with AI
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

export default ImageGenerator;
