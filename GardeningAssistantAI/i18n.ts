import { Language } from './types';

const translations = {
  en: {
    headerTitle: 'Gardening Assistant AI',
    languageSwitch: 'Español',
    identifyPlant: '1. Identify Your Plant',
    askQuestions: '2. Ask Questions',
    welcomeTitle: 'Welcome to your AI Gardening Assistant',
    welcomeMessage: 'Upload a photo of a plant to identify it, get detailed care instructions, and start a conversation with your personal gardening expert.',
    dropFiles: 'Drop files to Attach, or',
    browse: 'browse',
    analyzingPlant: 'Analyzing your plant...',
    plantAnalysis: 'Plant Analysis',
    plantInstructionsPlaceholder: 'Your plant care instructions will appear here.',
    chatPlaceholder: 'Your chat will appear here after you identify a plant.',
    askFollowUp: 'Ask a follow-up question...',
    failedToAnalyze: 'Failed to analyze the image. Please try another one.',
    chatError: 'Sorry, I encountered an error. Please try again.',
  },
  es: {
    headerTitle: 'Asistente de Jardinería IA',
    languageSwitch: 'English',
    identifyPlant: '1. Identifica tu Planta',
    askQuestions: '2. Haz Preguntas',
    welcomeTitle: 'Bienvenido a tu Asistente de Jardinería IA',
    welcomeMessage: 'Sube la foto de una planta para identificarla, obtener instrucciones de cuidado detalladas y comenzar una conversación con tu experto personal en jardinería.',
    dropFiles: 'Arrastra archivos para adjuntar, o',
    browse: 'explora',
    analyzingPlant: 'Analizando tu planta...',
    plantAnalysis: 'Análisis de la Planta',
    plantInstructionsPlaceholder: 'Las instrucciones de cuidado de tu planta aparecerán aquí.',
    chatPlaceholder: 'Tu chat aparecerá aquí después de que identifiques una planta.',
    askFollowUp: 'Haz una pregunta de seguimiento...',
    failedToAnalyze: 'No se pudo analizar la imagen. Por favor, intenta con otra.',
    chatError: 'Lo siento, encontré un error. Por favor, intenta de nuevo.',
  }
};

export const t = (key: keyof typeof translations.en, lang: Language): string => {
  return translations[lang][key] || translations.en[key];
};
