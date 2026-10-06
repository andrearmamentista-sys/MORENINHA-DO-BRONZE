import React, { useState } from 'react';
import {
  ChevronLeft,
  Calendar,
  Clock,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Home,
  CreditCard,
  QrCode,
  MapPin,
  Check,
  UserCheck,
  Heart,
  Users,
  ShieldCheck,
  Smartphone,
  Edit3,
  Zap,
  Flame,
  Percent
} from 'lucide-react';
import { Service, Booking, StudioSettings, PaymentMethod, StaffMember, ServiceHourOption } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { DynamicPixCard } from './DynamicPixCard';
import {
  generateAffectionateClientConfirmationMessage,
  generateStaffNotificationMessage
} from '../utils/whatsappMessages';
import mascotImage from '../assets/images/mascote.jpg';

interface BookingWizardProps {
  selectedService: Service;
  settings: StudioSettings;
  staff: StaffMember[];
  initialSelectedStaffId?: string;
  existingBookings: Booking[];
  isAdminLoggedIn?: boolean;
  onOpenEditMessages?: () => void;
  onCancel: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
}

const DEFAULT_HOUR_TIERS: ServiceHourOption[] = [
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

export const BookingWizard: React.FC<BookingWizardProps> = ({
  selectedService,
  settings,
  staff,
  initialSelectedStaffId,
  existingBookings,
  isAdminLoggedIn,
  onOpenEditMessages,
  onCancel,
  onBookingConfirmed
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Hourly selection for Bronze Marquinha VIP
  const isMarquinha =
    selectedService.title.toLowerCase().includes('marquinha') ||
    selectedService.title.toLowerCase().includes('fita');

  const hourTiers: ServiceHourOption[] = selectedService.hourOptions || DEFAULT_HOUR_TIERS;
  const [activeHours, setActiveHours] = useState<number>(selectedService.selectedHours || 1);

  const activeTier = isMarquinha
    ? hourTiers.find((t) => t.hours === activeHours) || hourTiers[0]
    : null;

  const currentPrice = activeTier ? activeTier.price : selectedService.price;
  const currentDuration = activeTier ? activeTier.duration : selectedService.duration;
  const currentTitle = activeTier
    ? `Bronze Marquinha VIP (Fita) - ${activeTier.label}`
    : selectedService.title;

  // Staff Selection State
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    initialSelectedStaffId || staff[0]?.id || ''
  );

  // Step 1 State - Date & Time
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');

  // Step 2 State - Anamnese
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPhototype, setClientPhototype] = useState('Pele Clara / Morena Clara (Tipo III)');
  const [clientPregnant, setClientPregnant] = useState('Não');
  const [clientHealth, setClientHealth] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState('');

  // Step 3 - Payment Method: Default to 'local' (payment on site)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('local');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Time Slots
  const morningSlots = ['08:30', '10:00', '11:30'];
  const afternoonSlots = ['14:00', '15:30', '17:00'];

  const selectedStaff = staff.find((s) => s.id === selectedStaffId);

  // Capacity Control: Max 2 clients in the salon at the same time
  const getSlotBookingsCount = (time: string) => {
    return existingBookings.filter(
      (b) => b.date === selectedDate && b.time === time && b.status !== 'cancelado'
    ).length;
  };

  const isSlotStaffBooked = (time: string) => {
    if (!selectedStaffId) return false;
    return existingBookings.some(
      (b) =>
        b.date === selectedDate &&
        b.time === time &&
        b.status !== 'cancelado' &&
        b.professionalId === selectedStaffId
    );
  };

  const handlePhoneChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);

    if (digits.length > 6) {
      setClientPhone(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
    } else if (digits.length > 2) {
      setClientPhone(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else if (digits.length > 0) {
      setClientPhone(`(${digits}`);
    } else {
      setClientPhone('');
    }
  };

  const handleGoToStep2 = () => {
    if (!selectedDate || !selectedTime) return;
    setStep(2);
  };

  const handleGoToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !termsAccepted) {
      setFormError('Por favor preencha seu nome, WhatsApp e confirme a veracidade dos dados.');
      return;
    }
    setFormError('');
    setStep(3);
  };

  const handleConfirmBooking = () => {
    const chosenProfessionalName = selectedStaff?.name || 'Primeira Profissional Disponível';

    const newBooking: Booking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      serviceId: selectedService.id,
      serviceTitle: currentTitle,
      professionalId: selectedStaffId || undefined,
      professionalName: chosenProfessionalName,
      date: selectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      phototype: clientPhototype,
      pregnant: clientPregnant,
      health: clientHealth.trim() || 'Nenhuma ressalva informada',
      total: currentPrice,
      paymentMethod,
      status: 'confirmado',
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    onBookingConfirmed(newBooking);
    setConfirmedBooking(newBooking);

    // Open WhatsApp with affectionate confirmation message
    openWhatsAppAffectionateMessage(newBooking);
  };

  const openWhatsAppAffectionateMessage = (booking: Booking) => {
    const affectionateMsg = generateAffectionateClientConfirmationMessage(booking, settings);
    const cleanDigits = booking.clientPhone.replace(/\D/g, '');
    const phoneWithDDI = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
    const waUrl = `https://wa.me/${phoneWithDDI}?text=${encodeURIComponent(affectionateMsg)}`;
    window.open(waUrl, '_blank');
  };

  const openWhatsAppStaffNotification = (booking: Booking) => {
    const chosenStaff = staff.find((s) => s.id === booking.professionalId) || staff[0];
    const staffPhone = chosenStaff?.phone || settings.whatsapp;
    const cleanStaffPhone = staffPhone.replace(/\D/g, '');
    const phoneWithDDI = cleanStaffPhone.startsWith('55') ? cleanStaffPhone : `55${cleanStaffPhone}`;
    const staffMsg = generateStaffNotificationMessage(booking, settings, chosenStaff);
    const waUrl = `https://wa.me/${phoneWithDDI}?text=${encodeURIComponent(staffMsg)}`;
    window.open(waUrl, '_blank');
  };

  // POST-CONFIRMATION SUCCESS SCREEN
  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-4">
        {/* Success Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60 animate-bounce">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Agendamento Confirmado com Carinho!</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Seu horário está garantido!
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
              Olá <strong className="text-white">{confirmedBooking.clientName}</strong>, seu
              atendimento exclusivo com{' '}
              <strong className="text-gold-300">{confirmedBooking.professionalName}</strong> foi
              registrado com sucesso!
            </p>
          </div>

          {/* Quick Ticket Badge */}
          <div className="bg-ruby-950/90 rounded-2xl p-4 sm:p-5 border border-ruby-800 text-xs flex flex-wrap items-center justify-between gap-4 text-left shadow-inner">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                Procedimento & Profissional
              </span>
              <span className="font-semibold text-white text-sm block">{confirmedBooking.serviceTitle}</span>
              <span className="text-gold-400 font-medium text-xs flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Profissional: {confirmedBooking.professionalName}</span>
              </span>
              <span className="text-gray-400 font-mono block text-[11px]">
                Código: {confirmedBooking.id}
              </span>
            </div>

            <div className="space-y-1 text-right sm:text-left">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                Data & Horário
              </span>
              <span className="font-semibold text-gold-400 text-sm block">
                {confirmedBooking.date.split('-').reverse().join('/')} às {confirmedBooking.time}
              </span>
              <span className="text-[11px] text-gray-300 block">{settings.address}</span>
            </div>
          </div>

          {/* Payment Method Notice */}
          {confirmedBooking.paymentMethod === 'local' ? (
            <div className="bg-gradient-to-br from-ruby-900/60 via-ruby-950 to-ruby-900/40 border border-gold-400/40 rounded-2xl p-5 text-left space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-gold-400">
                <CreditCard className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Pagamento no Local</h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                O valor total de{' '}
                <strong className="text-gold-400 font-bold tabular-nums">
                  R$ {confirmedBooking.total.toFixed(2).replace('.', ',')}
                </strong>{' '}
                será pago diretamente no estúdio no dia do seu bronze com a{' '}
                <strong className="text-white">{confirmedBooking.professionalName}</strong>. Sem
                necessidade de sinal antecipado!
              </p>
              <div className="pt-2 border-t border-ruby-800/80 flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                <span className="text-white font-medium">Aceitamos no estúdio:</span>
                <span>Cartão de Crédito</span>
                <span aria-hidden="true">·</span>
                <span>Débito</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">Pix no Balcão</span>
                <span aria-hidden="true">·</span>
                <span>Dinheiro</span>
              </div>
            </div>
          ) : (
            <DynamicPixCard
              amount={selectedService.price}
              pixKey={settings.pixKey}
              beneficiaryName={settings.pixBeneficiary}
              city="Rio de Janeiro"
              txId={confirmedBooking.id.replace(/[^a-zA-Z0-9]/g, '')}
              description={`Pagamento ${confirmedBooking.id}`}
              title="QR Code Pix do Seu Atendimento"
              subtitle="Pague antecipadamente o valor total do procedimento via Pix"
            />
          )}

          {/* Affectionate WhatsApp Message CTA */}
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-left space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Mensagem Carinhosa Preparada</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Preparamos uma mensagem com dicas especiais para sua pele chegar perfeita no estúdio.
              Clique no botão abaixo para abrir a conversa no WhatsApp!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Button 1: Send Affectionate Message to Client */}
            <button
              onClick={() => openWhatsAppAffectionateMessage(confirmedBooking)}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/60 transition cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>🌸 Enviar Confirmação Carinhosa para a Cliente</span>
            </button>

            {/* Button 2: Alert Professional on her Smartphone */}
            <button
              onClick={() => openWhatsAppStaffNotification(confirmedBooking)}
              className="w-full py-3 rounded-xl bg-ruby-900 hover:bg-ruby-800 border border-gold-400/60 text-gold-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-gold-400" />
              <span>📲 Avisar {confirmedBooking.professionalName} no Celular</span>
            </button>

            {/* Admin Message Template Customizer Trigger */}
            {isAdminLoggedIn && onOpenEditMessages && (
              <button
                type="button"
                onClick={onOpenEditMessages}
                className="w-full py-2 rounded-xl bg-ruby-950/90 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-xs font-semibold border border-gold-400/40 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>✏️ Editar Mensagens de Confirmação (Admin)</span>
              </button>
            )}

            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl border border-ruby-700/80 hover:bg-ruby-900/50 text-xs text-gray-300 hover:text-white transition flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Concluir e Voltar ao Início</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header Step Tracker */}
      <div className="glass-panel rounded-2xl p-4 border border-ruby-700/50 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Catálogo</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              step >= 1 ? 'bg-ruby-500 text-white shadow-md' : 'bg-ruby-950 text-gray-500'
            }`}
          >
            1
          </span>
          <span className="text-gray-600">·</span>
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              step >= 2 ? 'bg-ruby-500 text-white shadow-md' : 'bg-ruby-900 text-gray-400'
            }`}
          >
            2
          </span>
          <span className="text-gray-600">·</span>
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              step === 3 ? 'bg-ruby-500 text-white shadow-md' : 'bg-ruby-900 text-gray-400'
            }`}
          >
            3
          </span>
        </div>

        <span className="text-xs font-medium text-gold-400">
          {step === 1 && 'Profissional & Horário'}
          {step === 2 && 'Anamnese Digital'}
          {step === 3 && 'Pagamento & Confirmação'}
        </span>
      </div>

      {/* Selected Service Summary Bar */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-ruby-700/40">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gold-400/30">
            <ImageWithFallback
              src={selectedService.image}
              alt={currentTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">
              Procedimento Selecionado
            </span>
            <h4 className="font-serif text-sm font-bold text-white">{currentTitle}</h4>
            <p className="text-xs text-gray-300">
              Duração: <strong className="text-white">{currentDuration}</strong> · Valor:{' '}
              <strong className="text-gold-400 font-bold">R$ {currentPrice.toFixed(2).replace('.', ',')}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-[11px] text-gold-400 hover:text-gold-300 underline cursor-pointer"
        >
          Trocar
        </button>
      </div>

      {/* STEP 1: CHOOSE PROFESSIONAL & DATE & TIME */}
      {step === 1 && (
        <div className="glass-panel rounded-2xl p-6 space-y-6 border border-ruby-700/50">
          {/* HOURLY SELECTOR & FLASHING PROMO BANNER FOR BRONZE MARQUINHA VIP */}
          {isMarquinha && (
            <div className="space-y-3.5 border-b border-ruby-800/60 pb-5">
              {/* Eye-catching Blinking Promo Banner */}
              <div className="animate-blink-promo rounded-2xl p-3 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 border-2 border-yellow-300 shadow-xl text-center">
                <div className="flex items-center justify-center gap-2 text-white font-extrabold text-xs sm:text-sm tracking-wide">
                  <Zap className="w-4 h-4 fill-yellow-200 animate-bounce text-yellow-200 shrink-0" />
                  <span className="animate-flash-text uppercase">
                    PROMOÇÃO PISCANDO: DESCONTO POR HORA ATIVADO!
                  </span>
                  <Zap className="w-4 h-4 fill-yellow-200 animate-bounce text-yellow-200 shrink-0" />
                </div>
                <p className="text-[11px] font-semibold text-yellow-100 drop-shadow mt-0.5">
                  Adicione horas na sua sessão e ganhe desconto progressivo automático!
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Escolha a Duração do seu Bronze VIP (Fita):</span>
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {hourTiers.map((tier) => {
                    const isSelected = tier.hours === activeHours;
                    return (
                      <button
                        key={tier.hours}
                        type="button"
                        onClick={() => setActiveHours(tier.hours)}
                        className={`p-3 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-br from-sky-500 to-blue-700 text-white border-gold-400 shadow-lg shadow-sky-500/40 ring-2 ring-gold-400/60 scale-[1.02]'
                            : 'bg-ruby-950/70 text-gray-300 border-ruby-800 hover:border-sky-400 hover:text-white'
                        }`}
                      >
                        {tier.isPopular && (
                          <span className="absolute top-1 right-1 text-[8px] bg-amber-500 text-ruby-950 font-black px-1 rounded">
                            TOP 1
                          </span>
                        )}
                        <span className="font-bold text-xs sm:text-sm">{tier.label}</span>
                        <span className="text-[11px] text-gray-300">{tier.duration}</span>
                        <span
                          className={`text-xs font-bold mt-1 ${
                            isSelected ? 'text-yellow-300' : 'text-gold-400'
                          }`}
                        >
                          R$ {tier.price.toFixed(0)}
                        </span>
                        <span className="text-[10px] opacity-75 line-through">
                          R$ {tier.originalPrice.toFixed(0)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeTier && (
                  <div className="mt-2.5 rounded-xl p-2.5 bg-sky-950/70 border border-sky-400/30 flex items-center justify-between text-xs text-sky-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Percent className="w-3.5 h-3.5 text-gold-400" />
                      <span>Desconto Especial Aplicado:</span>
                    </span>
                    <span className="font-bold text-yellow-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                      {activeTier.discountBadge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 1.1 Choose Professional (Duas Funcionárias) */}
          <div className="space-y-3 border-b border-ruby-800/60 pb-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-400" />
                <span>{isMarquinha ? '2. Escolha com Quem Deseja Fazer o Atendimento' : '1. Escolha com Quem Deseja Fazer o Atendimento'}</span>
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Selecione a especialista de sua preferência para realizar sua sessão:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {staff.map((member) => {
                const isSelected = selectedStaffId === member.id;
                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      setSelectedStaffId(member.id);
                      setSelectedTime(''); // reset slot when changing staff
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 relative ${
                      isSelected
                        ? 'bg-ruby-900/90 border-gold-400 shadow-lg shadow-ruby-950/80 ring-1 ring-gold-400/50'
                        : 'bg-ruby-950/60 border-ruby-800 hover:border-ruby-700'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gold-400/50 bg-ruby-950">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white text-xs truncate">{member.name}</h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-gold-500 text-ruby-950 text-xs font-bold flex items-center justify-center shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gold-400 font-medium block truncate">
                        {member.role}
                      </span>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                        {member.specialty}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1.2 Date Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-300">Data do Atendimento:</label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
              }}
              className="w-full bg-ruby-950/90 border border-ruby-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* 1.3 Time Slots with 2-Client Capacity Limit & Conflict Checking */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gold-400/90 block">
                Horários Disponíveis (Máximo 2 pessoas simultâneas no estúdio):
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                Capacidade controlada
              </span>
            </div>

            {/* Morning */}
            <div>
              <span className="text-[11px] text-gray-400 block mb-2">Manhã:</span>
              <div className="grid grid-cols-3 gap-2.5">
                {morningSlots.map((time) => {
                  const count = getSlotBookingsCount(time);
                  const isFull = count >= 2;
                  const isStaffBusy = isSlotStaffBooked(time);
                  const isSelected = selectedTime === time;

                  const isDisabled = isFull || isStaffBusy;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2.5 rounded-xl text-center border transition flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gold-500 text-ruby-950 border-gold-400 shadow-lg font-bold'
                          : isDisabled
                          ? 'bg-ruby-950/30 text-gray-600 border-ruby-900/50 cursor-not-allowed opacity-50'
                          : 'bg-ruby-950/80 text-gray-200 border-ruby-700 hover:border-gold-400/60 font-semibold'
                      }`}
                    >
                      <span className="text-xs">{time}</span>
                      <span className="text-[9px]">
                        {isFull
                          ? 'Lotado (2/2)'
                          : isStaffBusy
                          ? `${selectedStaff?.name.split(' ')[0]} Ocupada`
                          : count === 1
                          ? '1 vaga restante'
                          : '2 vagas livres'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon */}
            <div>
              <span className="text-[11px] text-gray-400 block mb-2">Tarde:</span>
              <div className="grid grid-cols-3 gap-2.5">
                {afternoonSlots.map((time) => {
                  const count = getSlotBookingsCount(time);
                  const isFull = count >= 2;
                  const isStaffBusy = isSlotStaffBooked(time);
                  const isSelected = selectedTime === time;

                  const isDisabled = isFull || isStaffBusy;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2.5 rounded-xl text-center border transition flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gold-500 text-ruby-950 border-gold-400 shadow-lg font-bold'
                          : isDisabled
                          ? 'bg-ruby-950/30 text-gray-600 border-ruby-900/50 cursor-not-allowed opacity-50'
                          : 'bg-ruby-950/80 text-gray-200 border-ruby-700 hover:border-gold-400/60 font-semibold'
                      }`}
                    >
                      <span className="text-xs">{time}</span>
                      <span className="text-[9px]">
                        {isFull
                          ? 'Lotado (2/2)'
                          : isStaffBusy
                          ? `${selectedStaff?.name.split(' ')[0]} Ocupada`
                          : count === 1
                          ? '1 vaga restante'
                          : '2 vagas livres'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-ruby-800/60">
            <span className="text-xs text-gray-400">
              {selectedTime
                ? `${selectedDate.split('-').reverse().join('/')} às ${selectedTime} com ${selectedStaff?.name}`
                : 'Escolha a data e um horário disponível'}
            </span>

            <button
              onClick={handleGoToStep2}
              disabled={!selectedTime}
              className={`ruby-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition flex items-center space-x-1.5 cursor-pointer ${
                !selectedTime ? 'opacity-40 cursor-not-allowed' : 'shadow-lg'
              }`}
            >
              <span>Próximo: Anamnese</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ANAMNESE DIGITAL FORM */}
      {step === 2 && (
        <div className="glass-panel rounded-2xl p-6 space-y-6 border border-ruby-700/50">
          <div className="border-b border-ruby-800/60 pb-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-gold-400" />
              <span>2. Ficha de Anamnese Digital</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Protocolo de segurança para {selectedStaff?.name} calibrar os cosméticos no seu tipo de pele
            </p>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-ruby-950/80 border border-ruby-600 text-ruby-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-ruby-400" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleGoToStep3} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="w-full bg-ruby-950/80 border border-ruby-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(21) 99999-9999"
                  className="w-full bg-ruby-950/80 border border-ruby-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Fototipo de Pele *
                </label>
                <select
                  value={clientPhototype}
                  onChange={(e) => setClientPhototype(e.target.value)}
                  className="w-full bg-ruby-950/90 border border-ruby-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="Pele Muito Clara (Tipo I/II - Queima fácil)">
                    Pele Muito Clara (Tipo I/II - Queima fácil)
                  </option>
                  <option value="Pele Clara / Morena Clara (Tipo III)">
                    Pele Clara / Morena Clara (Tipo III)
                  </option>
                  <option value="Pele Morena Escura (Tipo IV/V)">
                    Pele Morena Escura (Tipo IV/V)
                  </option>
                  <option value="Pele Negra (Tipo VI)">Pele Negra (Tipo VI)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Está grávida ou amamentando? *
                </label>
                <select
                  value={clientPregnant}
                  onChange={(e) => setClientPregnant(e.target.value)}
                  className="w-full bg-ruby-950/90 border border-ruby-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="Não">Não</option>
                  <option value="Sim (Gestante)">Sim (Gestante)</option>
                  <option value="Sim (Lactante)">Sim (Lactante)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Alergias, medicamentos em uso ou sensibilidade na pele:
              </label>
              <textarea
                value={clientHealth}
                onChange={(e) => setClientHealth(e.target.value)}
                placeholder="Ex: Alergia a óleos específicos, uso de ácidos faciais/corporais, pressão baixa ou nenhum."
                rows={2}
                className="w-full bg-ruby-950/80 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="pt-2 flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded bg-ruby-950 border-ruby-700 text-ruby-600 focus:ring-ruby-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-300 cursor-pointer select-none">
                Confirmo que as informações prestadas são verdadeiras e estou de acordo com as
                recomendações do estúdio (vir sem maquiagem e hidratada).
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-ruby-800/60">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs border border-ruby-700 text-gray-300 hover:bg-ruby-900/50 transition cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="ruby-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span>Próximo: Pagamento & Confirmação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: PAYMENT METHOD & FINAL CONFIRMATION */}
      {step === 3 && (
        <div className="glass-panel rounded-2xl p-6 space-y-6 border border-ruby-700/50">
          <div className="text-center space-y-1 border-b border-ruby-800/60 pb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-950/50">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Revise seu Agendamento</h3>
            <p className="text-xs text-gray-400">
              Escolha a forma de pagamento de sua preferência para concluir sua reserva
            </p>
          </div>

          {/* Mascot Cheerleader Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-sky-950/70 border border-sky-400/30 shadow-md">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400 shrink-0 bg-slate-900 shadow">
              <img
                src={mascotImage}
                alt="Mascote Moreninha VIP com biquíni azul"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5 text-left">
              <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Mascote Moreninha VIP:</span>
              </span>
              <p className="text-xs text-sky-100 font-light">
                "Falta só um clique para confirmar seu atendimento e sair com aquela marquinha de fita impecável e simétrica!"
              </p>
            </div>
          </div>

          {/* Ticket Summary Box */}
          <div className="bg-ruby-950/90 rounded-2xl p-4 sm:p-5 border border-ruby-800 space-y-2.5 text-xs shadow-inner">
            <div className="flex justify-between pb-2 border-b border-ruby-900/80">
              <span className="text-gray-400">Procedimento:</span>
              <span className="font-semibold text-white">{selectedService.title}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-ruby-900/80">
              <span className="text-gray-400">Profissional Escolhida:</span>
              <span className="font-semibold text-gold-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{selectedStaff?.name}</span>
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-ruby-900/80">
              <span className="text-gray-400">Data e Horário:</span>
              <span className="font-semibold text-gold-400">
                {selectedDate.split('-').reverse().join('/')} às {selectedTime}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-ruby-900/80">
              <span className="text-gray-400">Cliente / Contato:</span>
              <span className="font-semibold text-white">
                {clientName} · {clientPhone}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-ruby-900/80">
              <span className="text-gray-400">Fototipo Declarado:</span>
              <span className="font-semibold text-ruby-300">{clientPhototype}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-white">Valor Total do Procedimento:</span>
              <span className="text-gold-400">
                R$ {selectedService.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white block">
              Como deseja realizar o pagamento?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Pagamento no Local (Recommended & Default) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('local')}
                className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                  paymentMethod === 'local'
                    ? 'bg-ruby-900/80 border-gold-400 shadow-xl shadow-ruby-950/70'
                    : 'bg-ruby-950/60 border-ruby-800 hover:border-ruby-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-gold-400">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-xs text-white">Pagar no Local</span>
                  </div>
                  {paymentMethod === 'local' && (
                    <span className="w-5 h-5 rounded-full bg-gold-500 text-ruby-950 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-gray-300 leading-snug">
                  Pague diretamente no estúdio no dia da sessão.
                </p>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-2">
                  ✓ Sem necessidade de adiantamento
                </span>
              </button>

              {/* Option 2: Pix Antecipado (Valor Total) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'bg-ruby-900/80 border-gold-400 shadow-xl shadow-ruby-950/70'
                    : 'bg-ruby-950/60 border-ruby-800 hover:border-ruby-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <QrCode className="w-5 h-5" />
                    <span className="font-bold text-xs text-white">Pix Antecipado</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <span className="w-5 h-5 rounded-full bg-gold-500 text-ruby-950 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-gray-300 leading-snug">
                  Pague o valor total agora e chegue com tudo quitado.
                </p>
                <span className="text-[10px] text-gold-400 font-semibold block mt-2">
                  Total: R$ {selectedService.price.toFixed(2).replace('.', ',')}
                </span>
              </button>
            </div>
          </div>

          {/* If Pix was selected, show the dynamic Pix card */}
          {paymentMethod === 'pix' && (
            <DynamicPixCard
              amount={selectedService.price}
              pixKey={settings.pixKey}
              beneficiaryName={settings.pixBeneficiary}
              city="Rio de Janeiro"
              txId="BKANTECIPADO"
              description={`Atendimento ${selectedService.title.slice(0, 20)}`}
              title="QR Code Pix do Valor Total"
              subtitle="Escaneie para pagar antecipadamente o valor integral"
            />
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleConfirmBooking}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>
                {paymentMethod === 'local'
                  ? 'Confirmar Agendamento (Pagar no Local)'
                  : 'Confirmar Agendamento & Abrir WhatsApp'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2 text-xs text-gray-400 hover:text-white transition cursor-pointer"
            >
              Voltar e corrigir dados da anamnese
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
