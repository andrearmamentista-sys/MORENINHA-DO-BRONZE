import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon, RotateCcw, Type, User } from 'lucide-react';
import { PhotoUploader } from './PhotoUploader';

interface DirectImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentUrl: string;
  defaultUrl: string;
  currentCaption?: string;
  captionLabel?: string;
  currentName?: string;
  nameLabel?: string;
  onSave: (newUrl: string, newCaption?: string, newName?: string) => void;
}

export const DirectImageModal: React.FC<DirectImageModalProps> = ({
  isOpen,
  onClose,
  title,
  currentUrl,
  defaultUrl,
  currentCaption = '',
  captionLabel = 'Legenda / Texto Descritivo:',
  currentName = '',
  nameLabel,
  onSave
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [caption, setCaption] = useState(currentCaption);
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setUrl(currentUrl);
    setCaption(currentCaption || '');
    setName(currentName || '');
  }, [currentUrl, currentCaption, currentName, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSave(url.trim(), caption.trim(), name.trim());
      onClose();
    }
  };

  const handleReset = () => {
    setUrl(defaultUrl);
    setCaption('');
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-ruby-700/60 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Imagem, Legenda & Textos</h3>
            <p className="text-xs text-gray-400 line-clamp-1">{title}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Photo Uploader */}
          <PhotoUploader
            currentImageUrl={url}
            onImageSelected={(newUrl) => setUrl(newUrl)}
            label="Escolha a Imagem (Envie do celular ou cole link)"
            previewHeight="h-44"
          />

          {/* Optional Name field (e.g. for Staff or Products) */}
          {nameLabel && (
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>{nameLabel}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome..."
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          )}

          {/* Caption / Legenda input */}
          <div className="space-y-1">
            <label className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-gold-400" />
              <span>{captionLabel}</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Digite a legenda ou subtítulo..."
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-ruby-800/60">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gold-400 flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs border border-ruby-700 text-gray-300 hover:bg-ruby-900/50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="ruby-gradient-btn px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Imagem & Textos</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
