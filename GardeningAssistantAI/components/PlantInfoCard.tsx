import React from 'react';
import { t } from '../i18n';
import { Language } from '../types';

interface PlantInfoCardProps {
  analysis: string;
  isLoading: boolean;
  language: Language;
}

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');

    return (
        <div className="prose max-w-none text-brand-text">
            {lines.map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-extrabold mt-6 mb-3">{line.substring(3)}</h2>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="font-bold">{line.substring(2, line.length - 2)}</p>;
                }
                 if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    return <li key={index} className="ml-5 list-disc">{line.trim().substring(2)}</li>;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};


export const PlantInfoCard: React.FC<PlantInfoCardProps> = ({ analysis, isLoading, language }) => {
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
       <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
         <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-xl font-bold mb-4 text-brand-text">{t('plantAnalysis', language)}</h3>
      <div className="bg-brand-green-light p-4 rounded-lg min-h-[200px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : analysis ? (
          <SimpleMarkdownRenderer content={analysis} />
        ) : (
          <p className="text-brand-text-light">{t('plantInstructionsPlaceholder', language)}</p>
        )}
      </div>
    </div>
  );
};
