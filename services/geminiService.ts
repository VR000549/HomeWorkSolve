
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const solveHomework = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1] || base64Image,
    },
  };

  const textPart = {
    text: `Analyse cette image de devoir. 
    Fournis UNIQUEMENT les résultats et réponses finales aux exercices. 
    NE DONNE AUCUNE EXPLICATION, aucune étape de calcul, aucun texte d'introduction ni de conclusion. 
    Sois extrêmement concis. Affiche juste les réponses directement.`
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        temperature: 0.1, // Réduit pour plus de précision et moins de "bavardage"
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "Désolé, je n'ai pas pu trouver les résultats.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Erreur lors de la communication avec l'IA.");
  }
};
