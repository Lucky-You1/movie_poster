import { GoogleGenAI, Type } from "@google/genai";
import { PosterData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate the text metadata
const generateTextMetadata = async (topic: string): Promise<Omit<PosterData, 'posterImage'>> => {
  const modelId = "gemini-2.5-flash";
  
  const systemInstruction = `
You are a database assistant for a poster design app.
Return the metadata for a minimalist movie/novel poster based on a user-provided title.
The summary should be 3 short, poetic lines (about 10-15 chars each) describing the theme.
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      titleCN: { type: Type.STRING, description: "Chinese title of the work" },
      titleEN: { type: Type.STRING, description: "English title of the work (uppercase)" },
      credits: { type: Type.STRING, description: "Format: '导演：Name / 原著：Name'" },
      year: { type: Type.STRING, description: "Release year formatted with spaces (e.g. '1 9 9 4')" },
      summary: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 lines of poetic summary",
      },
    },
    required: ["titleCN", "titleEN", "credits", "year", "summary"],
  };

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Get metadata for: "${topic}"`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("No text response from AI");
  return JSON.parse(jsonText);
};

// Helper to generate the image
const generatePosterImage = async (topic: string): Promise<string> => {
  const modelId = "gemini-2.5-flash-image";
  
  // Detailed prompt for the specific style requested
  const prompt = `
    Create a square (1:1) illustration for the movie/novel "${topic}".
    Style: Black and white manga/comic style strokes, ink illustration.
    Composition: Minimalist, clean lines, high contrast.
    Content: Only the main character(s) or iconic elements.
    Background: Pure white background.
    Do not include any text or letters in the image.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
       // Use default thinking/safety settings. 
       // aspectRatio is often a property of specific image models, but prompts help guide it for flash-image.
    }
  });

  // Iterate to find the image part
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
  }
  
  throw new Error("No image generated");
};

export const generatePosterData = async (topic: string): Promise<PosterData> => {
  try {
    // Run both generation tasks in parallel
    const [textData, imageBase64] = await Promise.all([
      generateTextMetadata(topic),
      generatePosterImage(topic)
    ]);

    return {
      ...textData,
      posterImage: `data:image/png;base64,${imageBase64}`,
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate poster. Please try again.");
  }
};