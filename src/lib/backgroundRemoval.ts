import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
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

let backgroundRemover: any | null = null;

const getBackgroundRemover = async () => {
  if (backgroundRemover) return backgroundRemover;

  try {
    // High-quality background removal model (works locally in-browser)
    backgroundRemover = await pipeline('background-removal', 'briaai/RMBG-1.4', {
      device: 'webgpu',
    });
  } catch (e) {
    console.warn('Failed to load briaai/RMBG-1.4, falling back to Xenova/modnet', e);
    backgroundRemover = await pipeline('background-removal', 'Xenova/modnet', {
      device: 'webgpu',
    });
  }

  return backgroundRemover;
};

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(
      `Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`
    );

    const imageData = canvas.toDataURL('image/png');

    const remover = await getBackgroundRemover();
    console.log('Processing with background removal model...');

    const output = await remover(imageData);

    if (!output || !Array.isArray(output) || !output[0]?.data) {
      throw new Error('Invalid background removal result');
    }

    const result = output[0];

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = result.width;
    outputCanvas.height = result.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');

    const pixels = new Uint8ClampedArray(result.data);
    const imageDataOut = new ImageData(pixels, result.width, result.height);

    outputCtx.putImageData(imageDataOut, 0, 0);

    return await new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
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

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
