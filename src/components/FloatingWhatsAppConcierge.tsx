import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StudioSettings } from '../types';

interface FloatingWhatsAppConciergeProps {
  settings: StudioSettings;
}

export const FloatingWhatsAppConcierge: React.FC<FloatingWhatsAppConciergeProps> = ({
  settings
}) => {
  const cleanPhone = settings.whatsapp.replace(/\D/g, '');

  return (
    <aside
      aria-label="Atendimento Direto WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex items-center group"
    >
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          'Olá, Mariana! Gostaria de tirar uma dúvida sobre os horários e procedimentos do Moreninha do Bronze.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-950/80 border border-emerald-400/30 transition-all transform hover:scale-105"
        title="Falar com a Especialista no WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>

        <MessageCircle className="w-4 h-4 text-white" />
        <span className="text-xs font-semibold whitespace-nowrap">
          Dúvidas no WhatsApp
        </span>
      </a>
    </aside>
  );
};
