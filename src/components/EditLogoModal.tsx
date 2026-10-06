import React, { useState } from 'react';
import { X, Check, Sparkles, Trash2, Sun } from 'lucide-react';
import { PhotoUploader } from './PhotoUploader';

interface EditLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl?: string;
  studioName: string;
  onSaveLogo: (logoUrl: string) => void;
}

export const EditLogoModal: React.FC<EditLogoModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl = '',
  studioName,
  onSaveLogo
}) => {
  if (!isOpen) return null;

  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLogo(logoUrl.trim());
    onClose();
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    onSaveLogo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-ruby-700 space-y-4 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-ruby-800/80 pb-3">
          <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center font-bold text-xs">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Logo do Estúdio</h3>
            <p className="text-xs text-gray-400">
              Adicione a logomarca da sua loja enviando a foto direto do seu celular.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <PhotoUploader
            currentImageUrl={logoUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80'}
            onImageSelected={(url) => setLogoUrl(url)}
            label="Logomarca da Sua Loja"
            previewHeight="h-28"
          />

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Dica: Você pode escolher uma imagem PNG com fundo transparente ou foto quadrada. Se
            remover a imagem, o app exibirá o lindo ícone dourado padrão com o nome{' '}
            <strong className="text-white">{studioName}</strong>.
          </p>

          <div className="pt-2 border-t border-ruby-800/80 flex items-center justify-between">
            {currentLogoUrl ? (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="px-3 py-2 rounded-xl text-ruby-400 hover:text-white hover:bg-ruby-900/50 border border-ruby-800 transition flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Usar Ícone Padrão</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex space-x-2">
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
                <span>Salvar Logomarca</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
