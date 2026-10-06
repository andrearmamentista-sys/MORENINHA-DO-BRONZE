import React, { useState } from 'react';
import { Sparkles, Sun, Check, Heart, ChevronRight, Star, ShieldCheck } from 'lucide-react';
import mascotImage from '../assets/images/mascote.jpg';

interface MascotSpotlightProps {
  onStartBooking?: () => void;
  onExploreServices?: () => void;
}

export const MascotSpotlight: React.FC<MascotSpotlightProps> = ({
  onStartBooking,
  onExploreServices
}) => {
  const [isSparkling, setIsSparkling] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState(
    'O segredo do bronze perfeito está na montagem milimétrica da fita e na hidratação da derme. Vem ficar morena comigo!'
  );

  const speeches = [
    'O segredo do bronze perfeito está na montagem milimétrica da fita e na hidratação da derme. Vem ficar morena comigo!',
    'Olha a perfeição da minha marquinha com biquíni azul! Na Moreninha do Bronze você sai com essa mesma simetria impecável!',
    'Aqui o atendimento é 100% VIP e individual. Apenas você e a especialista em sala climatizada!',
    'Pele hidratada pós-sol garante fixação por muito mais dias. Não esquece de passar na Boutique Sensual!'
  ];

  const handleMascotClick = () => {
    setIsSparkling(true);
    const nextSpeech = speeches[(speeches.indexOf(activeSpeech) + 1) % speeches.length];
    setActiveSpeech(nextSpeech);
    setTimeout(() => setIsSparkling(false), 1200);
  };

  return (
    <section className="relative rounded-3xl overflow-hidden glass-panel border-2 border-sky-400/40 p-6 sm:p-8 shadow-2xl bg-gradient-to-br from-slate-950/90 via-blue-950/70 to-slate-950/95">
      {/* Background ambient lighting glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Mascot Character Visual with Animated Tape Glow */}
        <div className="relative shrink-0 flex flex-col items-center">
          {/* Animated floating backdrop rings */}
          <div className="relative group cursor-pointer" onClick={handleMascotClick}>
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-sky-400 via-gold-400 to-blue-600 opacity-60 blur-xl group-hover:opacity-100 transition-opacity animate-pulse-ring" />

            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-gold-400 shadow-[0_0_35px_rgba(56,189,248,0.5)] relative bg-slate-900 animate-float-gentle">
              <img
                src={mascotImage}
                alt="Mascote Oficial Moreninha do Bronze - Morena com marquinha de fita e biquíni azul"
                className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                  isSparkling ? 'scale-110 filter brightness-110' : ''
                }`}
              />

              {/* Tape-Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

              {/* Sparkle burst reaction indicator */}
              {isSparkling && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-3xl animate-ping">✨</span>
                </div>
              )}

              {/* Bottom Badge inside avatar */}
              <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950/90 border border-sky-400/60 text-[10px] font-bold text-sky-300 shadow-md">
                  <Sparkles className="w-3 h-3 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Marquinha de Fita Perfeita</span>
                </span>
              </div>
            </div>

            {/* Click me hint badge */}
            <div className="absolute -bottom-2 right-4 bg-gold-500 hover:bg-gold-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xl flex items-center gap-1 border border-amber-200 animate-bounce">
              <Heart className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>Clique na Morena!</span>
            </div>
          </div>
        </div>

        {/* Right: Explanatory Content & Mascot Voice */}
        <div className="space-y-4 text-center lg:text-left flex-1 max-w-xl">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Mascote Oficial do Bronze</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-gold-300 border border-gold-400/40 text-[10px] font-bold uppercase tracking-wider">
              Biquíni Azul & Fita Milimétrica
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
            A Marquinha dos Seus Sonhos com a Assinatura da Moreninha
          </h3>

          {/* Interactive Mascot Speech Box */}
          <div className="p-4 rounded-2xl bg-sky-950/60 border border-sky-400/30 text-left relative shadow-inner">
            <div className="flex items-start space-x-3">
              <span className="text-xl shrink-0">💬</span>
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block mb-0.5">
                  Fala da Morena VIP:
                </span>
                <p className="text-xs sm:text-sm text-gray-200 font-light leading-relaxed italic">
                  "{activeSpeech}"
                </p>
              </div>
            </div>
          </div>

          {/* Tape Features Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-200 pt-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-sky-900/60">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-medium">Fita hipoalergênica anatômica</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-sky-900/60">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-medium">Linhas 100% nítidas e simétricas</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-sky-900/60">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-medium">Dourado intenso sem descamação</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-sky-900/60">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-medium">Avaliação individual de fototipo</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
            {onStartBooking && (
              <button
                onClick={onStartBooking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(2,132,199,0.5)] transition flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>Quero Minha Marquinha de Fita</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {onExploreServices && (
              <button
                onClick={onExploreServices}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-200 hover:text-white border border-sky-700/80 font-semibold text-xs sm:text-sm transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Ver Todos os Procedimentos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
