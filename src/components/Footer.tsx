import React from 'react';
import { Sun, Heart, Shield, MessageCircle } from 'lucide-react';
import { StudioSettings } from '../types';

interface FooterProps {
  settings: StudioSettings;
  onOpenImageManager: () => void;
  onOpenAdminAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenImageManager,
  onOpenAdminAuth
}) => {
  return (
    <footer className="border-t border-ruby-900/60 bg-ruby-950/90 py-8 mt-14 text-xs text-gray-400">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ruby-600 to-gold-400 flex items-center justify-center text-white shadow-md">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-gold-400">{settings.studioName}</p>
              <p className="text-[11px] text-ruby-300/80">{settings.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-gray-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Retirada Sigilosa & Embalagem Discreta
            </span>
            <span>·</span>
            <button
              onClick={onOpenImageManager}
              className="text-gold-400 hover:text-gold-300 transition underline"
            >
              Configurar Links Diretos de Imagens
            </button>
            <span>·</span>
            <button
              onClick={onOpenAdminAuth}
              className="text-ruby-300 hover:text-white transition underline"
            >
              Área Administrativa
            </button>
          </div>
        </div>

        <div className="border-t border-ruby-900/50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p>© 2026 {settings.studioName}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito para valorizar a sua autoestima com bronze perfeito e cuidado VIP
          </p>
        </div>
      </div>
    </footer>
  );
};
