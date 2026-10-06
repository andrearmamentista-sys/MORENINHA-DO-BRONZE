import React, { useState } from 'react';
import { X, Check, Crown, Image as ImageIcon } from 'lucide-react';
import { StudioSettings } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { PhotoUploader } from './PhotoUploader';

interface EditHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onSave: (updated: { heroTitle: string; heroDesc: string; heroImage: string }) => void;
}

export const EditHeroModal: React.FC<EditHeroModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(
    settings.heroTitle || 'Sua marquinha perfeita com o luxo e o cuidado que você merece.'
  );
  const [desc, setDesc] = useState(
    settings.heroDesc ||
      'Procedimentos personalizados com fita milimétrica, aceleradores importados e acompanhamento rigoroso por fototipo de pele. Agende seu horário com pagamento no local no dia do atendimento e preencha sua anamnese digital em menos de 1 minuto.'
  );
  const [heroImage, setHeroImage] = useState(settings.heroImage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      heroTitle: title.trim(),
      heroDesc: desc.trim(),
      heroImage: heroImage.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-ruby-700 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-ruby-800/80 pb-3">
          <div className="w-8 h-8 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center font-bold text-xs">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Banner Principal (Hero)</h3>
            <p className="text-xs text-gray-400">
              Altere o título principal, texto de apresentação e a foto do banner de entrada.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
          {/* Headline */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Título de Destaque *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Texto Descritivo *</label>
            <textarea
              rows={3}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Hero Image Uploader with phone upload support */}
          <PhotoUploader
            currentImageUrl={heroImage}
            onImageSelected={(url) => setHeroImage(url)}
            label="Foto do Banner Principal (Envie do celular)"
            previewHeight="h-36"
          />

          {/* Action buttons */}
          <div className="pt-3 border-t border-ruby-800/80 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-ruby-700 text-gray-300 hover:text-white hover:bg-ruby-900/50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="ruby-gradient-btn px-5 py-2 rounded-xl text-white font-semibold shadow transition cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
