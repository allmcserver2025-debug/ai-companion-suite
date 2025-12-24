import { supabase } from "@/integrations/supabase/client";

const MAX_IMAGE_DIMENSION = 1536;

function resizeImageIfNeeded(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log("Starting background removal process...");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image dimensions: ${canvas.width}x${canvas.height}`);

    const imageBase64 = canvas.toDataURL("image/png");

    console.log("Calling background removal API...");
    const { data, error } = await supabase.functions.invoke("remove-background", {
      body: { imageBase64 },
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Failed to remove background");
    }

    if (!data?.image) {
      throw new Error("No image returned from API");
    }

    console.log("Converting result to blob...");
    const response = await fetch(data.image);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error("Error removing background:", error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
