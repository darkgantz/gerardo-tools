import { GoogleGenAI } from "@google/genai";
import { ChatMessage, MessageRole, Language } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const analyzePlantImage = async (base64ImageData: string, mimeType: string, language: Language): Promise<string> => {
    const prompt = language === 'es'
    ? `
        Identifica la planta en esta imagen. 
        Proporciona su nombre común y científico en negrita.
        Luego, da instrucciones de cuidado detalladas pero fáciles de entender en español.
        Incluye secciones para:
        ## Riego
        ## Luz Solar
        ## Suelo
        ## Temperatura y Humedad
        ## Plagas Comunes
        Formatea la respuesta en Markdown limpio.
    `
    : `
        Identify the plant in this image. 
        Provide its common and scientific name in bold.
        Then, give detailed but easy-to-understand care instructions in English.
        Include sections for:
        ## Watering
        ## Sunlight
        ## Soil
        ## Temperature & Humidity
        ## Common Pests
        Format the response in clean Markdown.
    `;
    
    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing plant image:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};

export const continueChat = async (history: ChatMessage[], language: Language): Promise<string> => {
    const systemInstruction = language === 'es'
    ? "Eres un amigable y experto asistente de jardinería chatbot. Tu nombre es Leafy. Mantén tus respuestas concisas y útiles, centrándote en temas de jardinería y respondiendo en español. No repitas información del análisis inicial de la planta a menos que se te pregunte."
    : "You are a friendly and knowledgeable gardening assistant chatbot. Your name is Leafy. Keep your responses concise and helpful, focusing on gardening topics and responding in English. Don't repeat information from the initial plant analysis unless asked.";


    const contents = history.map(msg => {
        // Map app roles to Gemini roles
        let role: 'user' | 'model';
        if (msg.role === MessageRole.USER) {
            role = 'user';
        } else {
            role = 'model'; // Treat BOT and SYSTEM as model responses for context
        }
        return {
            role: role,
            parts: [{ text: msg.content }]
        };
    });

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error continuing chat:", error);
        throw new Error("Failed to get a response from the chatbot.");
    }
};
