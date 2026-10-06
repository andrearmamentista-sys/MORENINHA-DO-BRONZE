import React from 'react';
import { Droplet, SunMedium, Sparkles, HeartHandshake, Shield, Heart } from 'lucide-react';
import mascotImage from '../assets/images/mascote.jpg';

export const TanningGuide: React.FC = () => {
  return (
    <section className="space-y-6 pt-4">
      <div className="border-b border-sky-800/40 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 block mb-1">
            Protocolo de Segurança & Durabilidade
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Como Preparar Sua Pele para o Bronze Perfeito
          </h3>
        </div>
        <span className="text-xs text-sky-300 font-light">
          Resultado simétrico e cor duradoura por até 25 dias
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1: Pre-Tanning */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-sky-800/50 space-y-3 flex flex-col justify-between hover:border-sky-400/50 transition-all duration-300">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-gold-400 tabular-nums">01</span>
              <Droplet className="w-5 h-5 text-gold-400/80" />
            </div>
            <h4 className="font-serif text-base font-bold text-white">
              Antes da Sessão (24h antes)
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed font-light">
              Realize uma esfoliação corporal leve para uniformizar a camada superficial da derme. No
              dia do procedimento, venha sem maquiagem, desodorante ou óleos hidratantes.
            </p>
          </div>
          <div className="pt-3 border-t border-sky-900/60 text-[11px] text-sky-300">
            Dica VIP: Beba bastante água nas 12h anteriores.
          </div>
        </div>

        {/* Step 2: During the Session */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-sky-800/50 space-y-3 flex flex-col justify-between hover:border-sky-400/50 transition-all duration-300">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-gold-400 tabular-nums">02</span>
              <SunMedium className="w-5 h-5 text-gold-400/80" />
            </div>
            <h4 className="font-serif text-base font-bold text-white">
              Durante o Atendimento
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed font-light">
              Nossa Personal Bronze desenha o biquíni de fita anatômica milimetricamente no seu biotipo,
              aplicando dermocosméticos ativadores calibrados especificamente para a sua melanina.
            </p>
          </div>
          <div className="pt-3 border-t border-sky-900/60 text-[11px] text-emerald-400">
            Traçado 100% estéril e descartável.
          </div>
        </div>

        {/* Step 3: Post-Tanning Care */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-sky-800/50 space-y-3 flex flex-col justify-between hover:border-sky-400/50 transition-all duration-300">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-gold-400 tabular-nums">03</span>
              <Sparkles className="w-5 h-5 text-gold-400/80" />
            </div>
            <h4 className="font-serif text-base font-bold text-white">
              Manutenção Pós-Bronze
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed font-light">
              Aguarde de 4 a 6 horas para o primeiro banho com água morna. Aplique o gel calmante
              pós-sol e mantenha a pele hidratada para prolongar a tonalidade e evitar descamação.
            </p>
          </div>
          <div className="pt-3 border-t border-sky-900/60 text-[11px] text-sky-300">
            Durabilidade média: de 2 a 3 semanas.
          </div>
        </div>
      </div>

      {/* Mascot Special Tip Callout Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-sky-400/30 bg-gradient-to-r from-sky-950/80 via-blue-900/40 to-slate-950/90 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-400 shrink-0 shadow-lg relative bg-slate-900">
          <img
            src={mascotImage}
            alt="Mascote Moreninha VIP com marquinha de fita e biquíni azul"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gold-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dica de Ouro da Mascote Morena VIP:</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed font-light">
            "A fita adesiva especial de bronzeamento não estica durante a sessão ao contrário do tecido convencional, o que garante bordas retas como navalha e uma marquinha perfeita que não borra nem sai do lugar!"
          </p>
        </div>
      </div>
    </section>
  );
};
