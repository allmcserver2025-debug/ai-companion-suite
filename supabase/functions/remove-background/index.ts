import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { InferenceClient } from "https://esm.sh/@huggingface/inference";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const HF_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    if (!HF_TOKEN) {
      console.error("HUGGING_FACE_ACCESS_TOKEN is not configured");
      return new Response(
        JSON.stringify({ error: "HuggingFace API token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert base64 to blob
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const imageBlob = new Blob([bytes], { type: "image/png" });

    console.log("Removing background with RMBG-1.4 model");

    const hf = new InferenceClient(HF_TOKEN);

    const resultBlob = await hf.imageToImage({
      model: "briaai/RMBG-1.4",
      inputs: imageBlob,
    });
    const arrayBuffer = await resultBlob.arrayBuffer();
    const resultBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const resultUrl = `data:image/png;base64,${resultBase64}`;

    console.log("Background removed successfully");

    return new Response(
      JSON.stringify({ image: resultUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error removing background:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to remove background" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
