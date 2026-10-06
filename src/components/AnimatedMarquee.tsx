import React from 'react';
import { Sparkles, Sun, Heart, Crown, Gem } from 'lucide-react';

export const AnimatedMarquee: React.FC = () => {
  const items = [
    { text: 'MARQUINHA DE FITA MILIMÉTRICA', icon: Sparkles },
    { text: 'NOVO VISUAL AZUL SAFIRA VIP', icon: Gem },
    { text: 'MAIS DE 2.500 CLIENTES BRONZEADAS', icon: Crown },
    { text: 'ESPAÇO PRIVATIVO 100% CLIMATIZADO', icon: Sun },
    { text: 'ACELERADORES IMPORTADOS DE MELANINA', icon: Sparkles },
    { text: 'BOUTIQUE SENSUAL EXCLUSIVA', icon: Heart }
  ];

  return (
    <div className="w-full overflow-hidden py-2.5 bg-gradient-to-r from-sky-950/90 via-blue-900/80 to-sky-950/90 border-y border-sky-400/30 backdrop-blur-md relative shadow-lg">
      <div className="flex w-max animate-marquee space-x-8 text-xs font-bold text-sky-200 uppercase tracking-widest">
        {[...items, ...items, ...items].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center space-x-2 shrink-0">
              <Icon className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span>{item.text}</span>
              <span className="text-sky-500/60 pl-6">✦</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
