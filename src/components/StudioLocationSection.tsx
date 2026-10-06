import React from 'react';
import { MapPin, Navigation, Phone, Check, Edit2 } from 'lucide-react';
import { StudioSettings } from '../types';

interface StudioLocationSectionProps {
  settings: StudioSettings;
  isAdminLoggedIn?: boolean;
  onEditSettings?: () => void;
}

export const StudioLocationSection: React.FC<StudioLocationSectionProps> = ({
  settings,
  isAdminLoggedIn,
  onEditSettings
}) => {
  const cleanPhone = settings.whatsapp.replace(/\D/g, '');

  return (
    <section id="studio-vip" className="space-y-4 pt-2 scroll-mt-20">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-ruby-800/50 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Ambient subtle light */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block mb-1">
              Localização & Conforto Exclusivo
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
              <span>Nosso Studio VIP</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              {settings.address} · {settings.cityState}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gold-300 font-medium bg-ruby-950/80 px-3.5 py-1.5 rounded-xl border border-ruby-800">
              {settings.hours}
            </span>

            {isAdminLoggedIn && onEditSettings && (
              <button
                onClick={onEditSettings}
                title="Editar endereço e horários (Admin)"
                className="p-2 rounded-xl bg-gold-500 text-ruby-950 font-bold hover:bg-gold-400 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Studio Comfort Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-300 pt-3 border-t border-ruby-900/60 relative z-10">
          <div className="flex items-center gap-2 bg-ruby-950/40 p-2.5 rounded-xl border border-ruby-800/40">
            <Check className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-medium">Ambiente Climatizado</span>
          </div>
          <div className="flex items-center gap-2 bg-ruby-950/40 p-2.5 rounded-xl border border-ruby-800/40">
            <Check className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-medium">Máx. 2 Clientes Simultâneas</span>
          </div>
          <div className="flex items-center gap-2 bg-ruby-950/40 p-2.5 rounded-xl border border-ruby-800/40">
            <Check className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-medium">Ducha Pós-Sol Térmica</span>
          </div>
          <div className="flex items-center gap-2 bg-ruby-950/40 p-2.5 rounded-xl border border-ruby-800/40">
            <Check className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-medium">Biquíni Descartável Estéril</span>
          </div>
        </div>

        {/* Map & WhatsApp CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${settings.address}, ${settings.cityState}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full py-3 px-4 rounded-xl bg-ruby-900/80 hover:bg-ruby-800 border border-ruby-700 text-gold-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md"
          >
            <Navigation className="w-4 h-4 text-gold-400" />
            <span>Traçar Rota no Google Maps</span>
          </a>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              'Olá! Gostaria de tirar dúvidas sobre os horários e localização do estúdio.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center space-x-2 transition shadow-md"
            title="Tirar dúvidas no WhatsApp"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
