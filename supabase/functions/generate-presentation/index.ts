import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, slideCount, tone, style } = await req.json();
    
    console.log('Generating presentation for topic:', topic);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional presentation creator. Generate a structured presentation with exactly ${slideCount} slides.
    
For each slide, provide:
- A clear, concise title (max 8 words)
- 3-5 bullet points (each max 15 words)
- Brief speaker notes (1-2 sentences)
- An image prompt that describes a professional, relevant image for this slide (be specific and descriptive)

The tone should be ${tone}.
Make the content professional, engaging, and well-researched.

IMPORTANT: Return ONLY valid JSON in this exact format, with no additional text:
{
  "title": "Main Presentation Title",
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "speakerNotes": "Brief notes for the presenter",
      "imagePrompt": "A detailed description for an image that represents this slide's content"
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a presentation about: ${topic}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from AI');
    }
    
    console.log('AI Response content:', content);
    
    // Parse the JSON from the response
    let presentationData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        presentationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse presentation data');
    }

    // Generate images for each slide using Lovable AI image generation
    console.log('Generating images for slides...');
    const slidesWithImages = await Promise.all(
      presentationData.slides.map(async (slide: { title: string; content: string[]; speakerNotes: string; imagePrompt?: string }, index: number) => {
        try {
          console.log(`Generating image for slide ${index + 1}: ${slide.imagePrompt || slide.title}`);
          
          const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-image-preview',
              messages: [
                {
                  role: 'user',
                  content: `Generate a professional, high-quality presentation slide image: ${slide.imagePrompt || slide.title}. Make it clean, modern, and suitable for a ${style} style presentation. No text in the image.`
                }
              ],
              modalities: ['image', 'text']
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
            
            if (imageUrl) {
              console.log(`Image generated successfully for slide ${index + 1}`);
              return { ...slide, imageBase64: imageUrl };
            }
          } else {
            console.error(`Failed to generate image for slide ${index + 1}:`, await imageResponse.text());
          }
        } catch (imgError) {
          console.error(`Error generating image for slide ${index + 1}:`, imgError);
        }
        
        // Return slide without image if generation fails
        return slide;
      })
    );

    presentationData.slides = slidesWithImages;

    return new Response(
      JSON.stringify(presentationData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating presentation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate presentation';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
