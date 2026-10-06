import React from 'react';
import { Sparkles, Check, Phone, Edit2, Users, Star, UserCheck } from 'lucide-react';
import { StudioSettings, StaffMember } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProfessionalAndStudioProps {
  settings: StudioSettings;
  staff: StaffMember[];
  isAdminLoggedIn?: boolean;
  onEditStaffPhoto?: (staffMember: StaffMember) => void;
  onEditStaff?: (staffMember: StaffMember) => void;
  onStartBookingWithStaff?: (staffMember: StaffMember) => void;
}

export const ProfessionalAndStudio: React.FC<ProfessionalAndStudioProps> = ({
  settings,
  staff,
  isAdminLoggedIn,
  onEditStaffPhoto,
  onEditStaff,
  onStartBookingWithStaff
}) => {
  return (
    <section id="profissionais" className="space-y-6 pt-4 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-ruby-800/40 pb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 block mb-1">
            {settings.studioSubtitle || 'Equipe Especializada & Espaço VIP'}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {settings.studioTitle || 'Nossas Profissionais do Bronze'}
          </h3>
        </div>
        <div className="text-xs text-ruby-300/80 flex items-center gap-2">
          <span>Escolha com quem realizar o seu atendimento</span>
          <span aria-hidden="true">·</span>
          <span>Ambiente 100% privativo</span>
        </div>
      </div>

      {/* Staff Members Cards (2 dedicated specialists) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {staff.map((member) => (
          <div
            key={member.id}
            className="glass-card rounded-2xl p-5 sm:p-6 border border-ruby-800/50 flex flex-col justify-between relative group hover:border-gold-400/40 transition-all duration-300"
          >
            {/* Top Admin Quick Edit Button */}
            {isAdminLoggedIn && onEditStaff && (
              <button
                onClick={() => onEditStaff(member)}
                title="Editar nome, legenda, especialidade e dados da profissional"
                className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-xl bg-gold-500 hover:bg-gold-400 text-ruby-950 font-bold text-[11px] shadow-lg flex items-center space-x-1 transition cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Editar Profissional</span>
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Specialist Avatar with upload support */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-gold-400/80 shadow-xl bg-ruby-950">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    fallbackTitle={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onEditImage={() => onEditStaffPhoto?.(member)}
                  />
                </div>

                {/* Only visible to logged-in admin */}
                {isAdminLoggedIn && onEditStaffPhoto && (
                  <button
                    onClick={() => onEditStaffPhoto(member)}
                    title="Alterar foto da profissional (Admin)"
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-gold-500 text-ruby-950 font-bold hover:bg-gold-400 transition shadow-lg cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Specialist Details */}
              <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0 pr-0 sm:pr-8">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
                  {member.role}
                </span>
                <h4 className="font-serif text-xl font-bold text-white tracking-tight">
                  {member.name}
                </h4>
                <p className="text-[11px] text-ruby-300 font-medium">
                  {member.specialty}
                </p>
                <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ruby-900/60 flex items-center justify-between text-xs">
              <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Agenda Aberta
              </span>

              {onStartBookingWithStaff && (
                <button
                  onClick={() => onStartBookingWithStaff(member)}
                  className="px-4 py-2 rounded-xl bg-ruby-900/80 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-xs font-semibold border border-ruby-700 transition cursor-pointer shadow-md"
                >
                  Agendar com {member.name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
