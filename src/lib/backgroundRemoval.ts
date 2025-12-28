import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers';

// Configure transformers.js - models load from CDN, cached in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

let modelPromise: Promise<any> | null = null;
let processorPromise: Promise<any> | null = null;

// Lazy load the RMBG model (loads from HuggingFace CDN, cached in browser - no user download needed)
async function getModelAndProcessor() {
  if (!modelPromise || !processorPromise) {
    console.log('Loading RMBG model from CDN (first time may take a moment)...');
    
    modelPromise = AutoModel.from_pretrained('briaai/RMBG-1.4', {
      device: 'webgpu',
    }).catch(() => {
      console.log('WebGPU not available, using CPU...');
      return AutoModel.from_pretrained('briaai/RMBG-1.4');
    });
    
    processorPromise = AutoProcessor.from_pretrained('briaai/RMBG-1.4');
  }
  
  const [model, processor] = await Promise.all([modelPromise, processorPromise]);
  return { model, processor };
}

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

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal with RMBG model...');
    
    // Load model and processor from CDN
    const { model, processor } = await getModelAndProcessor();
    console.log('Model loaded successfully');
    
    // Create canvas and resize if needed
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Processing image: ${canvas.width}x${canvas.height}`);
    
    // Convert canvas to RawImage for the model
    const imageDataUrl = canvas.toDataURL('image/png');
    const image = await RawImage.fromURL(imageDataUrl);
    
    // Process the image
    const { pixel_values } = await processor(image);
    
    // Run the model
    console.log('Running RMBG model...');
    const { output } = await model({ input: pixel_values });
    
    // Post-process the mask - resize to original dimensions
    const maskData = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(canvas.width, canvas.height);
    
    // Create output canvas with transparency
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Get image data and apply mask to alpha channel
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const pixels = outputImageData.data;
    
    for (let i = 0; i < maskData.data.length; i++) {
      pixels[i * 4 + 3] = maskData.data[i]; // Set alpha from mask
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Background removed successfully');
    
    // Convert to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};
