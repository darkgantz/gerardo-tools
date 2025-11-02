import React, { useRef, useCallback } from 'react';
import { UploadIcon, SpinnerIcon } from './icons';
import { t } from '../i18n';
import { Language } from '../types';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
  isLoading: boolean;
  language: Language;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl, isLoading, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {!imagePreviewUrl && (
         <label 
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-brand-green focus:outline-none">
          <span className="flex items-center space-x-2">
              <UploadIcon className="w-6 h-6 text-gray-600"/>
              <span className="font-medium text-gray-600">
                  {t('dropFiles', language)}&nbsp;
                  <span className="text-brand-green underline">{t('browse', language)}</span>
              </span>
          </span>
      </label>
      )}

      {imagePreviewUrl && (
        <div className="relative w-full aspect-square max-h-[400px] mx-auto rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
          <img src={imagePreviewUrl} alt="Plant preview" className="object-cover w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <SpinnerIcon className="w-12 h-12 text-white" />
              <p className="text-white mt-2">{t('analyzingPlant', language)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
