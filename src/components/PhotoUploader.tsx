import React, { useRef, useState } from 'react';
import { Upload, Camera, Link as LinkIcon, Check, Image as ImageIcon } from 'lucide-react';
import { processImageFile } from '../utils/imageUpload';
import { ImageWithFallback } from './ImageWithFallback';

interface PhotoUploaderProps {
  currentImageUrl: string;
  onImageSelected: (url: string) => void;
  label?: string;
  previewHeight?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentImageUrl,
  onImageSelected,
  label = 'Foto / Imagem',
  previewHeight = 'h-36'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(currentImageUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressedDataUrl = await processImageFile(file);
      onImageSelected(compressedDataUrl);
      setUrlInputValue(compressedDataUrl);
    } catch (err: any) {
      alert(err.message || 'Erro ao processar imagem.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    if (urlInputValue.trim()) {
      onImageSelected(urlInputValue.trim());
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-gray-300 font-medium block text-xs">{label} *</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-gold-400 hover:text-gold-300 underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Ocultar Link URL' : 'Digitar Link URL'}</span>
        </button>
      </div>

      {/* Live Preview Box */}
      <div className={`w-full ${previewHeight} rounded-xl overflow-hidden bg-ruby-950 border border-ruby-800 relative group shadow-inner`}>
        <ImageWithFallback
          src={currentImageUrl}
          alt="Visualização"
          className="w-full h-full object-cover"
        />

        {/* Overlay hover hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="text-xs text-white font-medium bg-ruby-950/90 px-3 py-1.5 rounded-lg border border-gold-400/40 shadow">
            Visualização Atual
          </span>
        </div>
      </div>

      {/* Mobile/Device Photo Upload Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-ruby-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <span>Processando imagem...</span>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Adicionar Foto do Celular / Computador</span>
            </>
          )}
        </button>
      </div>

      {/* Alternative Direct URL Input */}
      {showUrlInput && (
        <div className="flex items-center space-x-1.5 pt-1">
          <input
            type="url"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="https://..."
            className="flex-1 bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-xl bg-ruby-900 hover:bg-ruby-800 border border-ruby-700 text-gold-300 text-xs font-semibold cursor-pointer"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
};
