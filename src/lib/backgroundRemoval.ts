import { env, AutoModel, AutoProcessor, RawImage } from "@huggingface/transformers";

// Configure transformers.js to use browser cache, not local files
env.allowLocalModels = false;
env.useBrowserCache = true;

let model: Awaited<ReturnType<typeof AutoModel.from_pretrained>> | null = null;
let processor: Awaited<ReturnType<typeof AutoProcessor.from_pretrained>> | null = null;

async function getModelAndProcessor() {
  if (!model || !processor) {
    console.log("Loading RMBG-1.4 model (first time may take a moment)...");
    model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
      // @ts-ignore - config option exists but not in types
      config: { model_type: "custom" },
    });
    processor = await AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
      // @ts-ignore
      config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        feature_extractor_type: "ImageFeatureExtractor",
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 0.00392156862745098,
        size: { width: 1024, height: 1024 },
      },
    });
    console.log("Model loaded successfully");
  }
  return { model, processor };
}

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const removeBackground = async (file: File): Promise<string> => {
  try {
    console.log("Starting browser-based background removal with RMBG-1.4...");

    const { model, processor } = await getModelAndProcessor();

    // Load image
    const image = await RawImage.fromBlob(file);

    // Process image
    const { pixel_values } = await processor!(image);

    // Run model
    const { output } = await model!({ input: pixel_values });

    // Get mask and resize to original size
    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
        image.width,
        image.height
      )
    ).data;

    // Create canvas with original image
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d")!;

    // Draw original image
    const htmlImage = await loadImage(file);
    ctx.drawImage(htmlImage, 0, 0);

    // Get image data and apply mask
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;

    for (let i = 0; i < maskData.length; i++) {
      pixelData[i * 4 + 3] = maskData[i]; // Set alpha channel from mask
    }

    ctx.putImageData(imageData, 0, 0);

    console.log("Background removed successfully");
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error removing background:", error);
    throw error;
  }
};
