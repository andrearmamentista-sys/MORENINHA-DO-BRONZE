import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, MessageCircle, X, ChevronRight, Sun, Award } from 'lucide-react';
import mascotImage from '../assets/images/mascote.jpg';

interface MascotWidgetProps {
  onStartBooking?: () => void;
  onExploreBoutique?: () => void;
}

const MASCOT_TIPS = [
  {
    title: 'Marquinha de Fita Perfeita!',
    text: 'A fita milimétrica garante simetria absoluta e linhas nítidas que valorizam seu corpo!',
    tag: 'Técnica VIP'
  },
  {
    title: 'Biquíni Azul & Dourado!',
    text: 'O tom azul royal é o segredo para contrastar e destacar ainda mais o seu bronzeado!',
    tag: 'Estilo Moreninha'
  },
  {
    title: 'Hidratação Pós-Bronze',
    text: 'Beba bastante água e use o hidratante pós-sol da boutique para fixar a cor por mais tempo!',
    tag: 'Dica de Ouro'
  },
  {
    title: 'Atendimento Privativo',
    text: 'Aqui o espaço é 100% climatizado e exclusivo para o seu conforto e privacidade.',
    tag: 'Conforto VIP'
  }
];

export const MascotWidget: React.FC<MascotWidgetProps> = ({
  onStartBooking,
  onExploreBoutique
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isBalloonOpen, setIsBalloonOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto rotate tips every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % MASCOT_TIPS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const currentTip = MASCOT_TIPS[currentTipIndex];

  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false);
          setIsBalloonOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 p-2 rounded-full glass-panel border-2 border-gold-400 shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center space-x-2 group cursor-pointer"
        title="Abrir Mascote Moreninha VIP"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border border-sky-400 relative">
          <img
            src={mascotImage}
            alt="Mascote Moreninha do Bronze com biquíni azul"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
        </div>
        <span className="text-[11px] font-bold text-gold-300 pr-2 hidden sm:inline">
          Dica da Morena ✨
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Assistente Virtual Moreninha VIP"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none select-none max-w-[320px] sm:max-w-[350px]"
    >
      {/* Speech Balloon with Interactive Tips */}
      {isBalloonOpen && (
        <div className="pointer-events-auto mb-2 glass-panel rounded-2xl p-3.5 border-2 border-sky-400/40 shadow-2xl relative animate-fadeIn text-left backdrop-blur-xl bg-slate-950/90 text-white">
          <button
            onClick={() => setIsBalloonOpen(false)}
            aria-label="Fechar balão de dicas da mascote"
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            title="Fechar balão"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-1.5 mb-1">
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              <span>{currentTip.tag}</span>
            </span>
            <span className="text-[10px] text-gold-400 font-semibold flex items-center gap-1">
              <Sun className="w-3 h-3 animate-spin text-amber-400" style={{ animationDuration: '10s' }} />
              <span>Moreninha VIP</span>
            </span>
          </div>

          <h5 className="font-serif text-xs font-bold text-white mb-0.5 pr-4">
            {currentTip.title}
          </h5>
          <p className="text-[11px] text-gray-200 leading-snug">
            {currentTip.text}
          </p>

          <div className="mt-2.5 pt-2 border-t border-sky-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {MASCOT_TIPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTipIndex(i)}
                  aria-label={`Ver dica ${i + 1} de ${MASCOT_TIPS.length}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentTipIndex ? 'w-4 bg-sky-400' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {onStartBooking && (
              <button
                onClick={() => {
                  onStartBooking();
                  setIsBalloonOpen(false);
                }}
                className="text-[10px] font-bold text-gold-300 hover:text-gold-200 flex items-center gap-0.5 transition cursor-pointer"
              >
                <span>Agendar Marquinha</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Balloon tail pointer */}
          <div className="absolute -bottom-2 right-12 w-4 h-4 bg-slate-950 border-r-2 border-b-2 border-sky-400/40 transform rotate-45" />
        </div>
      )}

      {/* Animated Mascot Character Card */}
      <div className="pointer-events-auto flex items-end space-x-2">
        <div className="relative group">
          {/* Floating animated aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 via-gold-400 to-blue-600 opacity-60 blur-md group-hover:opacity-100 animate-pulse-ring pointer-events-none" />

          {/* Main Mascot Avatar Circle */}
          <div
            onClick={() => {
              setIsBalloonOpen((prev) => !prev);
              setHasInteracted(true);
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold-400 shadow-2xl relative bg-slate-950 cursor-pointer animate-float-gentle group-hover:scale-105 transition-transform duration-300"
            title="Olá! Sou a Moreninha do Bronze. Clique para ver dicas da marquinha perfeita!"
          >
            <img
              src={mascotImage}
              alt="Mascote Moreninha do Bronze - Morena com marquinha de fita e biquíni azul"
              className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
            />

            {/* Glowing Tape-Bikini Badge overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-0.5 text-center">
              <span className="text-[8px] font-black uppercase tracking-tighter text-sky-300 flex items-center justify-center gap-0.5">
                <Sparkles className="w-2 h-2 text-gold-400" />
                <span>Marquinha VIP</span>
              </span>
            </div>
          </div>

          {/* Minimize / Close control button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute -top-1 -left-1 p-1 rounded-full bg-slate-900/90 text-gray-400 hover:text-white border border-sky-800 text-[10px] cursor-pointer shadow"
            title="Minimizar mascote"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
