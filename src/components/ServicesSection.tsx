import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  Clock,
  Edit2,
  Plus,
  Settings,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { Service, ServiceHourOption } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  onEditServiceImage: (service: Service) => void;
  isAdminLoggedIn?: boolean;
  onEditService?: (service: Service) => void;
  onAddNewService?: () => void;
  servicesTitle?: string;
  servicesSubtitle?: string;
}

const DEFAULT_HOUR_OPTIONS: ServiceHourOption[] = [
  {
    hours: 1,
    label: '1 Hora',
    duration: '60 min',
    price: 25.0,
    originalPrice: 35.0,
    discountBadge: 'Sessão Express',
    tag: 'Sessão Express'
  },
  {
    hours: 2,
    label: '2 Horas',
    duration: '120 min',
    price: 40.0,
    originalPrice: 55.0,
    discountBadge: 'Economize R$ 10',
    tag: 'Dourado Radiante'
  },
  {
    hours: 3,
    label: '3 Horas',
    duration: '180 min',
    price: 60.0,
    originalPrice: 85.0,
    discountBadge: 'Economize R$ 15',
    tag: 'Mais Pedida 🔥',
    isPopular: true
  }
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  onEditServiceImage,
  isAdminLoggedIn,
  onEditService,
  onAddNewService,
  servicesTitle,
  servicesSubtitle
}) => {
  // Filter strictly to Banho de Lua and Bronze Marquinha VIP (Fita)
  const displayServices = services.filter((s) => {
    const titleLower = s.title.toLowerCase();
    return (
      titleLower.includes('marquinha') ||
      titleLower.includes('fita') ||
      titleLower.includes('banho de lua') ||
      titleLower.includes('lua')
    );
  });

  // State to hold the chosen hour for each service (default 1h)
  const [selectedHours, setSelectedHours] = useState<Record<string, number>>({});

  const handleHourChange = (serviceId: string, hours: number) => {
    setSelectedHours((prev) => ({ ...prev, [serviceId]: hours }));
  };

  const handleBookServiceWithHour = (service: Service) => {
    const isMarquinha =
      service.title.toLowerCase().includes('marquinha') ||
      service.title.toLowerCase().includes('fita');

    if (isMarquinha) {
      const options = service.hourOptions || DEFAULT_HOUR_OPTIONS;
      const currentHours = selectedHours[service.id] || 1;
      const chosenOption = options.find((opt) => opt.hours === currentHours) || options[0];

      onSelectService({
        ...service,
        title: `Bronze Marquinha VIP (Fita) - ${chosenOption.label}`,
        duration: chosenOption.duration,
        price: chosenOption.price,
        selectedHours: chosenOption.hours
      });
    } else {
      onSelectService(service);
    }
  };

  return (
    <section id="procedimentos" className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-ruby-800/40 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 block mb-1">
            {servicesSubtitle || 'Menu de Procedimentos'}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <span>{servicesTitle || 'Procedimentos Exclusivos de Bronze & Cuidado'}</span>
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Escolha entre nossa técnica patenteada de fita milimétrica ou nosso banho de lua com descoloração indolor e toque acetinado.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-ruby-300/90 font-light flex items-center gap-2">
            <span className="font-semibold text-gold-400">{displayServices.length} Procedimentos Oficiais</span>
            <span aria-hidden="true">·</span>
            <span>Pagamento no local</span>
          </div>

          {isAdminLoggedIn && onAddNewService && (
            <button
              onClick={onAddNewService}
              className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-ruby-950 font-bold text-xs flex items-center space-x-1 shadow transition cursor-pointer"
              title="Adicionar novo procedimento"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Procedimento</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of the 2 Featured Procedures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {displayServices.map((service) => {
          const isMarquinha =
            service.title.toLowerCase().includes('marquinha') ||
            service.title.toLowerCase().includes('fita');

          const hourOptions = service.hourOptions || DEFAULT_HOUR_OPTIONS;
          const currentHourVal = selectedHours[service.id] || 1;
          const activeOption = hourOptions.find((o) => o.hours === currentHourVal) || hourOptions[0];

          const currentPrice = isMarquinha ? activeOption.price : service.price;
          const currentDuration = isMarquinha ? activeOption.duration : service.duration;

          return (
            <div
              key={service.id}
              className={`group glass-card rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between relative shadow-2xl ${
                isMarquinha
                  ? 'border-sky-400/50 bg-gradient-to-b from-blue-950/80 via-slate-950/90 to-blue-950/90 hover:border-gold-400'
                  : 'border-ruby-800/60 bg-gradient-to-b from-slate-950/90 via-blue-950/60 to-slate-950/90 hover:border-sky-400'
              }`}
            >
              <div>
                {/* Image Container */}
                <div className="h-56 sm:h-64 overflow-hidden relative bg-slate-950">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    fallbackTitle={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onEditImage={() => onEditServiceImage(service)}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
                    {isMarquinha ? (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-[11px] shadow-lg shadow-sky-900/60 flex items-center gap-1.5 border border-sky-300/40">
                        <Flame className="w-3.5 h-3.5 text-gold-300" />
                        <span>Mais Desejado VIP</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-ruby-950 font-bold text-[11px] shadow-lg flex items-center gap-1.5 border border-gold-300/40">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pele de Seda Dourada</span>
                      </span>
                    )}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs font-semibold text-gold-300 border border-gold-400/30 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>Duração: {currentDuration}</span>
                    </span>
                  </div>

                  {/* Admin Quick Edit Button */}
                  {isAdminLoggedIn && onEditService ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditService(service);
                      }}
                      title="Editar procedimento"
                      className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-ruby-950 text-xs font-bold shadow-lg flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditServiceImage(service);
                      }}
                      title="Alterar link desta imagem"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-sky-900 text-xs text-gold-300 border border-gold-400/30 flex items-center space-x-1 backdrop-blur-sm cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Trocar Imagem</span>
                    </button>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-gold-300 transition-colors leading-snug">
                      {service.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light mt-1.5">
                      {service.desc}
                    </p>
                  </div>

                  {/* HOURLY SELECTOR & FLASHING PROMO FOR BRONZE MARQUINHA VIP */}
                  {isMarquinha && (
                    <div className="space-y-3 pt-2">
                      {/* FLASHING / BLINKING PROMOTIONAL BANNER */}
                      <div className="animate-blink-promo rounded-2xl p-3 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 border-2 border-yellow-300 shadow-xl text-center">
                        <div className="flex items-center justify-center gap-1.5 text-white font-extrabold text-xs sm:text-sm tracking-wide">
                          <Zap className="w-4 h-4 fill-yellow-200 animate-bounce text-yellow-200 shrink-0" />
                          <span className="animate-flash-text uppercase">
                            PROMOÇÃO RELÂMPAGO PISCANDO!
                          </span>
                          <Zap className="w-4 h-4 fill-yellow-200 animate-bounce text-yellow-200 shrink-0" />
                        </div>
                        <p className="text-[11px] font-semibold text-yellow-100 drop-shadow mt-0.5">
                          Desconto progressivo por hora adicionada · Quanto mais horas, mais você economiza!
                        </p>
                      </div>

                      {/* Hour Toggle Buttons */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gold-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gold-400" />
                            Selecione a Duração do seu Bronze:
                          </span>
                          <span className="text-[11px] text-sky-300 font-semibold">
                            {activeOption.tag}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {hourOptions.map((opt) => {
                            const isSelected = opt.hours === currentHourVal;
                            return (
                              <button
                                key={opt.hours}
                                type="button"
                                onClick={() => handleHourChange(service.id, opt.hours)}
                                className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden ${
                                  isSelected
                                    ? 'bg-gradient-to-br from-sky-500 to-blue-700 text-white border-gold-400 shadow-lg shadow-sky-500/40 ring-2 ring-gold-400/50 scale-[1.03]'
                                    : 'bg-slate-900/90 text-gray-300 border-slate-700/80 hover:border-sky-400 hover:text-white'
                                }`}
                              >
                                {opt.isPopular && (
                                  <span className="absolute -top-1 right-1 text-[9px] bg-amber-500 text-ruby-950 font-extrabold px-1 rounded">
                                    TOP 1
                                  </span>
                                )}
                                <span className="font-bold text-xs sm:text-sm">{opt.label}</span>
                                <span
                                  className={`text-[11px] font-semibold mt-0.5 ${
                                    isSelected ? 'text-yellow-300' : 'text-gold-400'
                                  }`}
                                >
                                  R$ {opt.price.toFixed(0)}
                                </span>
                                <span className="text-[9px] opacity-80 mt-0.5 line-through">
                                  R$ {opt.originalPrice.toFixed(0)}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Hour Benefit Alert */}
                        <div className="rounded-xl p-2.5 bg-sky-950/70 border border-sky-400/30 flex items-center justify-between text-xs text-sky-200">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Percent className="w-3.5 h-3.5 text-gold-400" />
                            <span>Vantagem selecionada:</span>
                          </span>
                          <span className="font-bold text-yellow-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                            {activeOption.discountBadge}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Benefits List */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                      {service.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 sm:p-6 pt-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                    {isMarquinha ? `Valor para ${activeOption.label}` : 'Valor da Sessão'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 tabular-nums">
                      R$ {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    {isMarquinha && activeOption.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        R$ {activeOption.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdminLoggedIn && onEditService && (
                    <button
                      onClick={() => onEditService(service)}
                      className="p-2.5 rounded-xl border border-slate-700 text-gold-300 hover:bg-slate-800 transition cursor-pointer"
                      title="Editar configurações"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleBookServiceWithHour(service)}
                    className="ruby-gradient-btn px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-sky-900/50 flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <span>Agendar Horário</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
