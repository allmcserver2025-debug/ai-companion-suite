import { supabase } from "@/integrations/supabase/client";

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const removeBackground = async (file: File): Promise<string> => {
  try {
    console.log('Starting server-side background removal with RMBG-2.0...');
    
    const imageBase64 = await imageToBase64(file);
    
    const { data, error } = await supabase.functions.invoke('remove-background', {
      body: { imageBase64 }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to remove background');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data?.image) {
      throw new Error('No image returned from server');
    }

    console.log('Background removed successfully');
    return data.image;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};
