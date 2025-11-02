import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PlantInfoCard } from './components/PlantInfoCard';
import { Chatbot } from './components/Chatbot';
import { analyzePlantImage, continueChat } from './services/geminiService';
import { ChatMessage, MessageRole, Language } from './types';
import { LeafIcon } from './components/icons';
import { t } from './i18n';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [image, setImage] = useState<{ b64: string; mimeType: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setError(null);
    setAnalysis('');
    setChatMessages([]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setImage({ b64: base64String, mimeType: file.type });
      setImagePreview(reader.result as string);
      setIsAnalyzing(true);

      try {
        const plantInfo = await analyzePlantImage(base64String, file.type, language);
        setAnalysis(plantInfo);

        const plantNameMatch = plantInfo.match(/\*\*(.*?)\*\*/);
        const plantName = plantNameMatch ? plantNameMatch[1] : 'the identified plant';
        
        const systemMessage = language === 'es'
          ? `He identificado ${plantName}. ¡No dudes en preguntarme cualquier cosa sobre su cuidado o cualquier otro tema de jardinería!`
          : `I have identified ${plantName}. Feel free to ask me any questions about its care or any other gardening topics!`;

        setChatMessages([
          { role: MessageRole.SYSTEM, content: systemMessage },
        ]);
      } catch (e) {
        console.error(e);
        setError(t('failedToAnalyze', language));
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [language]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const newMessages: ChatMessage[] = [...chatMessages, { role: MessageRole.USER, content: message }];
    setChatMessages(newMessages);
    setIsChatting(true);
    setError(null);

    try {
      const botResponse = await continueChat(newMessages, language);
      setChatMessages(prev => [...prev, { role: MessageRole.BOT, content: botResponse }]);
    } catch (e) {
      console.error(e);
      setError(t('chatError', language));
    } finally {
      setIsChatting(false);
    }
  }, [chatMessages, language]);
  
  const WelcomeScreen = () => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full">
      <LeafIcon className="w-24 h-24 text-brand-green mb-6" />
      <h2 className="text-3xl font-bold text-brand-text mb-2">{t('welcomeTitle', language)}</h2>
      <p className="text-brand-text-light max-w-md">
        {t('welcomeMessage', language)}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-green-light font-sans text-brand-text">
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-brand-text">{t('identifyPlant', language)}</h2>
            <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={imagePreview} isLoading={isAnalyzing} language={language} />
            {imagePreview ? (
                 <PlantInfoCard analysis={analysis} isLoading={isAnalyzing} language={language} />
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex-grow flex items-center justify-center">
                   <WelcomeScreen />
                </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-brand-text mb-4">{t('askQuestions', language)}</h2>
             {imagePreview ? (
              <Chatbot
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatting}
                language={language}
              />
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg flex-grow flex flex-col items-center justify-center text-center p-8">
                    <p className="text-brand-text-light">{t('chatPlaceholder', language)}</p>
                </div>
            )}
          </div>

        </div>
        {error && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-xl">
                <p>{error}</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
