import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { removeBackground } from "@/lib/backgroundRemoval";

const BackgroundRemover = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessedImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image selected");
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Removing background... This may take a moment.");
    
    try {
      const resultUrl = await removeBackground(selectedFile);
      setProcessedImage(resultUrl);
      toast.dismiss(loadingToast);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Error removing background:", error);
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : "Failed to remove background";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `no-background-${Date.now()}.png`;
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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            Background Remover
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Remove backgrounds from images instantly using AI — 100% free, runs in your browser.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Click to upload an image</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports JPG, PNG, WebP
                  </p>
                </label>
              </div>

              {originalPreview && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Original</p>
                    <div className="border rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={originalPreview} 
                        alt="Original" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  {processedImage && (
                    <div>
                      <p className="text-sm font-medium mb-2">Background Removed</p>
                      <div className="border rounded-lg overflow-hidden bg-checkered">
                        <img 
                          src={processedImage} 
                          alt="Processed" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleRemoveBackground}
                  disabled={!selectedFile || isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Remove Background"}
                </Button>
                
                {processedImage && (
                  <Button 
                    onClick={handleDownload}
                    variant="outline"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              Background Remover - Powered by RMBG-2.0 AI
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

export default BackgroundRemover;
