import React from 'react';
import { ArrowDown, Gem, Star, Edit3, Sparkles, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroProps {
  heroImage: string;
  heroTitle?: string;
  heroDesc?: string;
  btnServicesText?: string;
  btnBoutiqueText?: string;
  isAdminLoggedIn?: boolean;
  onEditHero?: () => void;
  onEditHeroImage: () => void;
  onScrollToServices: () => void;
  onScrollToBoutique: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  heroImage,
  heroTitle,
  heroDesc,
  btnServicesText,
  btnBoutiqueText,
  isAdminLoggedIn,
  onEditHero,
  onEditHeroImage,
  onScrollToServices,
  onScrollToBoutique
}) => {
  const displayTitle = heroTitle || 'Sua marquinha perfeita com o luxo e o cuidado que você merece.';
  const displayDesc =
    heroDesc ||
    'Procedimentos personalizados com fita milimétrica, aceleradores importados e acompanhamento rigoroso por fototipo de pele. Agende seu horário com pagamento no local no dia do atendimento e preencha sua anamnese digital em menos de 1 minuto.';

  const displayServicesBtn = btnServicesText || 'Conhecer Procedimentos';
  const displayBoutiqueBtn = btnBoutiqueText || 'Boutique Sensual';

  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel border border-ruby-700/50 p-6 sm:p-10 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Admin Quick Edit Button when Logged In */}
      {isAdminLoggedIn && onEditHero && (
        <button
          onClick={onEditHero}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-gold-500 hover:text-slate-950 text-gold-300 text-xs font-semibold border border-gold-400/50 flex items-center space-x-1.5 shadow-lg transition backdrop-blur-md cursor-pointer"
          title="Editar textos do banner principal"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar Banner (Admin)</span>
        </button>
      )}

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
        {/* Left Column: Copy & Actions */}
        <div className="space-y-5 max-w-xl text-center lg:text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-gold-400 flex items-center justify-center lg:justify-start gap-2">
            <span>Studio VIP</span>
            <span aria-hidden="true" className="text-sky-400">/</span>
            <span>Boutique Exclusiva</span>
            <span aria-hidden="true" className="text-sky-400">/</span>
            <span>Rio de Janeiro</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12] text-balance">
            {displayTitle}
          </h2>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
            {displayDesc}
          </p>

          {/* High-Impact Attention-Grabbing CTAs */}
          <div className="pt-3 flex flex-wrap gap-4 justify-center lg:justify-start items-center">
            {/* CTA 1: Conhecer Procedimentos (Radiant Shimmer Luxury Button) */}
            <button
              onClick={onScrollToServices}
              className="relative group overflow-hidden px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-[0_0_25px_rgba(2,132,199,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center space-x-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-amber-500 hover:from-sky-400 hover:via-blue-500 hover:to-amber-400 border border-sky-300/40"
            >
              {/* Animated shimmer highlight effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
              <span className="tracking-wide">{displayServicesBtn}</span>
              <ArrowDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform shrink-0" />
            </button>

            {/* CTA 2: Boutique Sensual (Luminous Amber-Gold VIP Button) */}
            <button
              onClick={onScrollToBoutique}
              className="relative group overflow-hidden px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-gold-200 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.55)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center space-x-2.5 border-2 border-gold-400/80 hover:border-gold-300 bg-gradient-to-r from-ruby-950/95 via-amber-950/70 to-ruby-950/95 hover:from-amber-950/90 hover:to-ruby-900/90 backdrop-blur-md"
            >
              {/* Subtle gold shimmer on hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-gold-400/15 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

              <Gem className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="tracking-wide text-white group-hover:text-gold-200 transition-colors">
                {displayBoutiqueBtn}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-gold-500 text-ruby-950 text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0">
                VIP
              </span>
            </button>
          </div>

          {/* Social Proof Line */}
          <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs text-gray-400">
            <div className="flex -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-ruby-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            </div>
            <span>+2.500 clientes satisfeitas com pele dourada e hidratada</span>
          </div>
        </div>

        {/* Right Column: Hero Visual with Direct Link capability */}
        <div className="w-full lg:w-80 sm:w-96 group relative shrink-0">
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden relative shadow-2xl border border-ruby-600/40 bg-ruby-950">
            <ImageWithFallback
              src={heroImage}
              alt="Bronzeamento Profissional Moreninha do Bronze"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onEditImage={onEditHeroImage}
            />

            {/* Subtle luxury gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-ruby-950/90 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Proof Badge */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 pointer-events-none">
              <div className="bg-ruby-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gold-400/30 shadow-lg flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white">Marquinha Dourada VIP</span>
                <span className="text-[11px] font-bold text-gold-300 flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                  4.9 / 5.0
                </span>
              </div>
            </div>

            {/* Direct Link Hover Button */}
            <button
              onClick={onEditHeroImage}
              title="Trocar link direto da foto do banner"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-ruby-900 text-[11px] font-medium text-gold-300 border border-gold-400/40 flex items-center space-x-1 backdrop-blur-sm cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Alterar Imagem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
