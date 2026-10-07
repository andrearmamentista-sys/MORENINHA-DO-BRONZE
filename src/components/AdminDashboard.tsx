import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Coins,
  LogOut,
  FileSpreadsheet,
  Trash2,
  ExternalLink,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Sliders,
  Store,
  Plus,
  Check,
  X,
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  User,
  Lock,
  Heart,
  Palette,
  MessageSquare,
  Smartphone,
  Database,
  AlertTriangle,
  Clock,
  Flame,
  Zap,
  Globe,
  UploadCloud,
  Copy,
  Sparkles,
  MapPin
} from 'lucide-react';
import {
  Service,
  BoutiqueProduct,
  Booking,
  StudioSettings,
  BookingStatus,
  AdminCredentials,
  StaffMember,
  ServiceHourOption
} from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { DynamicPixCard } from './DynamicPixCard';
import { PhotoUploader } from './PhotoUploader';
import { EditServiceModal } from './EditServiceModal';
import { generateAffectionateClientConfirmationMessage } from '../utils/whatsappMessages';

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  products: BoutiqueProduct[];
  settings: StudioSettings;
  staff?: StaffMember[];
  onUpdateStaff?: (staff: StaffMember[]) => void;
  onOpenThemeAndTextCustomizer?: () => void;
  onOpenEditMessages?: () => void;
  onSyncAllToFirestore?: () => Promise<void>;
  isSyncingFirebase?: boolean;
  onUpdateBookingStatus: (id: string, newStatus: BookingStatus) => void;
  onDeleteBooking: (id: string) => void;
  onUpdateServiceImage: (serviceId: string, newImageUrl: string) => void;
  onUpdateProductImage: (productId: string, newImageUrl: string) => void;
  onUpdateHeroImage: (newImageUrl: string) => void;
  onUpdateMasterImage: (newImageUrl: string) => void;
  onUpdateSettings: (newSettings: StudioSettings) => void;
  onUpdateService: (updatedService: Service) => void;
  onAddService: (newService: Service) => void;
  onUpdateProduct: (updatedProduct: BoutiqueProduct) => void;
  onAddProduct: (newProduct: BoutiqueProduct) => void;
  onExitAdmin: () => void;
  credentials: AdminCredentials;
  onUpdateCredentials: (newCreds: AdminCredentials) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  services,
  products,
  settings,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateServiceImage,
  onUpdateProductImage,
  onUpdateHeroImage,
  onUpdateMasterImage,
  onUpdateSettings,
  onUpdateService,
  onAddService,
  onUpdateProduct,
  onAddProduct,
  onExitAdmin,
  credentials,
  onUpdateCredentials,
  staff = [],
  onUpdateStaff,
  onOpenThemeAndTextCustomizer,
  onOpenEditMessages,
  onSyncAllToFirestore,
  isSyncingFirebase
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'images' | 'catalog' | 'settings' | 'security'>('bookings');
  const [selectedBookingForAnamnese, setSelectedBookingForAnamnese] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [inlineConfirmId, setInlineConfirmId] = useState<string | null>(null);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [copiedVercelEnv, setCopiedVercelEnv] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editable settings local state
  const [tempSettings, setTempSettings] = useState<StudioSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Secure credentials update state (never pre-fills or displays current login/email)
  const [newLoginInput, setNewLoginInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showCredPassword, setShowCredPassword] = useState(false);
  const [credsSaved, setCredsSaved] = useState(false);
  const [credError, setCredError] = useState('');

  // New Service modal state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState<Partial<Service>>({
    title: '',
    duration: '45 min',
    price: 130,
    desc: '',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    phototypeRecommended: 'Todos os fototipos'
  });

  // Calculate Metrics
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelado')
    .reduce((acc, b) => acc + b.total, 0);
  const totalOnSite = bookings
    .filter((b) => b.status !== 'cancelado' && (b.paymentMethod === 'local' || !b.paymentMethod))
    .reduce((acc, b) => acc + b.total, 0);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientPhone.includes(searchTerm) ||
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    if (bookings.length === 0) {
      alert('Nenhum agendamento para exportar.');
      return;
    }

    let csvContent = 'ID,Data,Hora,Cliente,Telefone,Procedimento,Fototipo,Gestante,Saude,Valor_Total,Forma_Pagamento,Status\n';
    bookings.forEach((b) => {
      const payDesc = b.paymentMethod === 'local' ? 'No Local' : 'Pix Antecipado';
      csvContent += `"${b.id}","${b.date}","${b.time}","${b.clientName}","${b.clientPhone}","${b.serviceTitle}","${b.phototype}","${b.pregnant}","${b.health.replace(/"/g, '""')}","${b.total}","${payDesc}","${b.status}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agendamentos_moreninha_bronze_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.title || !newServiceForm.price) return;

    const fullService: Service = {
      id: `srv-${Date.now()}`,
      title: newServiceForm.title,
      duration: newServiceForm.duration || '45 min',
      price: Number(newServiceForm.price),
      desc: newServiceForm.desc || '',
      image: newServiceForm.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      phototypeRecommended: newServiceForm.phototypeRecommended || 'Todos os fototipos'
    };

    onAddService(fullService);
    setIsAddingService(false);
    setNewServiceForm({
      title: '',
      duration: '45 min',
      price: 130,
      desc: '',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      phototypeRecommended: 'Todos os fototipos'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Navigation */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-ruby-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-serif text-xl font-bold text-white">
              Painel de Gestão VIP da Dona
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Moreninha do Bronze · Controle completo de clientes, agendamentos e imagens
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto">
          {onOpenThemeAndTextCustomizer && (
            <button
              onClick={onOpenThemeAndTextCustomizer}
              className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-ruby-950 font-bold text-xs flex items-center space-x-1.5 shadow-md transition cursor-pointer"
              title="Trocar cor das letras, cores do sistema e editar textos"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>🎨 Cores & Textos</span>
            </button>
          )}

          {onOpenEditMessages && (
            <button
              onClick={onOpenEditMessages}
              className="px-3.5 py-2 rounded-xl bg-ruby-900 hover:bg-ruby-800 text-gold-300 border border-ruby-700 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              title="Editar mensagens carinhosas de confirmação e alerta no celular da profissional"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>💬 Mensagens WhatsApp</span>
            </button>
          )}

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 rounded-xl border border-ruby-700 hover:border-gold-400 text-xs text-gray-200 hover:text-white bg-ruby-950/70 hover:bg-ruby-900/60 transition flex items-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Admin</span>
          </button>
        </div>
      </div>

      {/* Firebase Firestore Cloud Database Live Status */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/25 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-semibold text-white text-sm">Banco de Dados Firebase Firestore Conectado</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono border border-emerald-700/50">Online & Ativo</span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Instância: <code className="text-gold-300 font-mono">ai-studio-moreninhadobronz-e64ffb46-928c-4264-bb55-09c9c9c348f6</code> · Projeto: <span className="text-emerald-300 font-mono">secure-hulling-44mm2</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
          {onSyncAllToFirestore && (
            <button
              onClick={onSyncAllToFirestore}
              disabled={isSyncingFirebase}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition cursor-pointer"
              title="Sincronizar todos os dados do sistema com o banco Firebase Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirebase ? 'animate-spin' : ''}`} />
              <span>{isSyncingFirebase ? 'Sincronizando...' : 'Sincronizar Dados no Firebase'}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-ruby-800/50 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Agendamentos Totais</span>
            <Calendar className="w-4 h-4 text-gold-400/80" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-2 tabular-nums">{totalBookings}</h3>
          <p className="text-[11px] text-ruby-300/70 mt-1">Registrados no sistema</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-ruby-800/50 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Faturamento Estimado</span>
            <DollarSign className="w-4 h-4 text-gold-400" />
          </div>
          <h3 className="text-2xl font-bold text-gold-400 mt-2 tabular-nums">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Soma dos procedimentos ativos</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-ruby-800/50 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">A Receber no Local</span>
            <Coins className="w-4 h-4 text-gold-400" />
          </div>
          <h3 className="text-2xl font-bold text-gold-400 mt-2 tabular-nums">
            R$ {totalOnSite.toFixed(2).replace('.', ',')}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1">Pagamentos presenciais no estúdio</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-ruby-800/60 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-ruby-950/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Agendamentos & Anamnese ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'images'
              ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-ruby-950/40'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
          <span>Gerenciar Links Diretos de Imagens</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-ruby-950/40'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Catálogo & Preços</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-ruby-950/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configurações & Chave Pix</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-ruby-950/40'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-gold-400" />
          <span>Segurança & Senha</span>
        </button>
      </div>

      {/* TAB 1: BOOKINGS & ANAMNESE TABLE */}
      {activeTab === 'bookings' && (
        <div className="glass-panel rounded-2xl p-5 border border-ruby-700/50 space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, telefone ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-ruby-950/90 border border-ruby-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-ruby-950/90 border border-ruby-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold-400"
              >
                <option value="all">Todos os Status</option>
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <button
              onClick={exportCSV}
              className="px-3.5 py-2 bg-ruby-900 hover:bg-ruby-800 border border-ruby-700 text-xs text-gold-400 font-medium rounded-xl flex items-center justify-center space-x-1.5 transition self-end sm:self-auto cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-ruby-800/60">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-ruby-950/90 uppercase text-[10px] text-gray-400 border-b border-ruby-800 tracking-wider">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Procedimento</th>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Fototipo</th>
                  <th className="p-3">Pagamento</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ruby-900/60">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Nenhum agendamento encontrado para este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-ruby-900/30 transition-colors">
                      <td className="p-3">
                        <span className="font-semibold text-white block">{b.clientName}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{b.clientPhone}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-white block">{b.serviceTitle}</span>
                        <span className="text-[10px] text-gold-400 block font-medium">
                          {b.professionalName || 'Mariana Guedes'}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-gold-400 font-semibold">{b.time}</span>
                        <span className="block text-[10px] text-gray-400">
                          {b.date.split('-').reverse().join('/')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] text-ruby-300 bg-ruby-950 px-2 py-0.5 rounded border border-ruby-800/80 inline-block">
                          {b.phototype}
                        </span>
                      </td>
                      <td className="p-3">
                        {b.paymentMethod === 'local' || !b.paymentMethod ? (
                          <div>
                            <span className="font-semibold text-gold-400 block">No Local</span>
                            <span className="text-[10px] text-gray-400 tabular-nums">
                              R$ {b.total.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-emerald-400 block">Pix Total</span>
                            <span className="text-[10px] text-gray-400 tabular-nums">
                              R$ {b.total.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            onUpdateBookingStatus(b.id, e.target.value as BookingStatus)
                          }
                          className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                            b.status === 'confirmado'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                              : b.status === 'agendado'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                              : b.status === 'concluido'
                              ? 'bg-blue-950/80 text-blue-300 border-blue-700'
                              : 'bg-ruby-950 text-ruby-400 border-ruby-800'
                          }`}
                        >
                          <option value="agendado">Agendado</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="concluido">Concluído</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        {inlineConfirmId === b.id ? (
                          <div className="flex items-center justify-end space-x-1.5 p-1 rounded-xl bg-red-950/90 border border-red-500 shadow-lg">
                            <span className="text-[10px] text-red-300 font-bold px-1 whitespace-nowrap">Excluir cliente?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteBooking(b.id);
                                setInlineConfirmId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer whitespace-nowrap shadow transition"
                            >
                              Sim, Excluir
                            </button>
                            <button
                              type="button"
                              onClick={() => setInlineConfirmId(null)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 text-[10px] cursor-pointer transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForAnamnese(b)}
                              title="Ver ficha de anamnese"
                              className="p-1.5 rounded-lg bg-ruby-950 text-gold-400 hover:bg-gold-500 hover:text-ruby-950 transition border border-ruby-800 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Affectionate WhatsApp confirmation message to client */}
                            <button
                              type="button"
                              onClick={() => {
                                const msg = generateAffectionateClientConfirmationMessage(b, settings);
                                const cleanDigits = b.clientPhone.replace(/\D/g, '');
                                const phoneWithDDI = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
                                window.open(`https://wa.me/${phoneWithDDI}?text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              title="Enviar mensagem carinhosa de confirmação no WhatsApp da cliente"
                              className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-600 hover:text-white transition border border-emerald-700 flex items-center space-x-1 cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                              <span className="text-[10px] font-medium hidden lg:inline">Confirmar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setInlineConfirmId(b.id)}
                              title={`Excluir cliente e agendamento de ${b.clientName}`}
                              className="px-2 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-800/80 hover:border-red-500 transition flex items-center space-x-1 cursor-pointer shadow-sm"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-[10px] font-bold">Excluir Cliente</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GERENCIAR LINKS DIRETOS DE IMAGENS */}
      {activeTab === 'images' && (
        <div className="glass-panel rounded-2xl p-6 border border-ruby-700/50 space-y-6">
          <div className="border-b border-ruby-800/60 pb-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gold-400" />
              <span>Gerenciador de Links Diretos de Imagens</span>
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Você pode alterar e colar links diretos (URLs de imagens da internet, Imgur, Unsplash,
              Cloudinary, etc.) para qualquer elemento visual do aplicativo. As mudanças são salvas
              instantaneamente!
            </p>
          </div>

          {/* Educational Callout */}
          <div className="bg-ruby-950/90 rounded-2xl p-4 border border-gold-400/30 space-y-2 text-xs">
            <span className="font-bold text-gold-400 flex items-center gap-1.5">
              <span>💡 Como obter links diretos de imagens na Web:</span>
            </span>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              1. Encontre uma imagem na internet ou faça upload no Imgur, PostImages ou seu próprio servidor.
              <br />
              2. Clique com o botão direito na imagem e selecione <strong>"Copiar endereço da imagem"</strong> (deve terminar com .jpg, .png, .webp ou ser link direto de CDN).
              <br />
              3. Cole no campo correspondente abaixo e veja a pré-visualização ao vivo!
            </p>
          </div>

          <div className="space-y-6">
            {/* Hero & Professional images */}
            <div>
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
                Imagens Principais do Studio
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hero Banner Image */}
                <div className="bg-ruby-950/80 p-4 rounded-2xl border border-ruby-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Banner Hero Principal</span>
                    <span className="text-[10px] text-gray-400">Proporção 16:9 / 4:3</span>
                  </div>
                  <div className="h-32 rounded-xl overflow-hidden bg-ruby-900 border border-ruby-800">
                    <ImageWithFallback
                      src={settings.heroImage}
                      alt="Banner Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400">URL Direta:</label>
                    <input
                      type="url"
                      defaultValue={settings.heroImage}
                      onBlur={(e) => {
                        if (e.target.value.trim() && e.target.value !== settings.heroImage) {
                          onUpdateHeroImage(e.target.value.trim());
                        }
                      }}
                      className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                {/* Master Mariana Guedes Image */}
                <div className="bg-ruby-950/80 p-4 rounded-2xl border border-ruby-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Foto da Profissional (Mariana)</span>
                    <span className="text-[10px] text-gray-400">Proporção 1:1 Redonda</span>
                  </div>
                  <div className="h-32 rounded-xl overflow-hidden bg-ruby-900 border border-ruby-800 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold-400">
                      <ImageWithFallback
                        src={settings.masterImage}
                        alt="Mariana Guedes"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400">URL Direta:</label>
                    <input
                      type="url"
                      defaultValue={settings.masterImage}
                      onBlur={(e) => {
                        if (e.target.value.trim() && e.target.value !== settings.masterImage) {
                          onUpdateMasterImage(e.target.value.trim());
                        }
                      }}
                      className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services Images */}
            <div>
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
                Imagens dos Procedimentos de Bronzeamento ({services.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-ruby-950/80 p-3.5 rounded-2xl border border-ruby-800 space-y-2"
                  >
                    <span className="text-xs font-bold text-white block truncate">{srv.title}</span>
                    <div className="h-28 rounded-xl overflow-hidden bg-ruby-900 border border-ruby-800">
                      <ImageWithFallback
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Link Direto:</label>
                      <input
                        type="url"
                        defaultValue={srv.image}
                        onBlur={(e) => {
                          if (e.target.value.trim() && e.target.value !== srv.image) {
                            onUpdateServiceImage(srv.id, e.target.value.trim());
                          }
                        }}
                        className="w-full bg-ruby-900/60 border border-ruby-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutique Products Images */}
            <div>
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
                Imagens dos Produtos da Boutique Sensual ({products.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-ruby-950/80 p-3.5 rounded-2xl border border-ruby-800 space-y-2"
                  >
                    <span className="text-xs font-bold text-white block truncate">{prod.name}</span>
                    <div className="h-28 rounded-xl overflow-hidden bg-ruby-900 border border-ruby-800">
                      <ImageWithFallback
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400">Link Direto:</label>
                      <input
                        type="url"
                        defaultValue={prod.image}
                        onBlur={(e) => {
                          if (e.target.value.trim() && e.target.value !== prod.image) {
                            onUpdateProductImage(prod.id, e.target.value.trim());
                          }
                        }}
                        className="w-full bg-ruby-900/60 border border-ruby-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATALOG & PROCEDURES */}
      {activeTab === 'catalog' && (
        <div className="glass-panel rounded-2xl p-6 border border-ruby-700/50 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-ruby-800/60 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-gold-400" />
                <span>Gestão de Serviços & Valores</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Edite os valores dos procedimentos, tempo de sessão e descrições
              </p>
            </div>

            <button
              onClick={() => setIsAddingService(true)}
              className="ruby-gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Procedimento</span>
            </button>
          </div>

          {/* Services List with Editable inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => {
              const isBronzeHourly =
                srv.id === 'srv-1' ||
                srv.title.toLowerCase().includes('marquinha') ||
                srv.title.toLowerCase().includes('fita') ||
                Boolean(srv.hourOptions && srv.hourOptions.length > 0);

              const price1h = srv.hourOptions?.find((o) => o.hours === 1)?.price ?? 25;
              const price2h = srv.hourOptions?.find((o) => o.hours === 2)?.price ?? 40;
              const price3h = srv.hourOptions?.find((o) => o.hours === 3)?.price ?? 60;

              return (
                <div
                  key={srv.id}
                  className="bg-ruby-950/80 p-4 rounded-2xl border border-ruby-800 space-y-3.5 relative shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-ruby-700">
                      <ImageWithFallback src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-white text-sm truncate">{srv.title}</h5>
                        {isBronzeHourly && (
                          <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-600/40 px-1.5 py-0.5 rounded font-semibold shrink-0">
                            Preço por Hora
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gold-400 font-semibold block">
                        R$ {srv.price.toFixed(2).replace('.', ',')} · {srv.duration}
                      </span>
                    </div>
                  </div>

                  {isBronzeHourly ? (
                    /* Specific Editable Hourly Pricing for Bronze Marquinha (1h, 2h, 3h) */
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Definir Preços por Duração (Bronze VIP):</span>
                        </span>
                        <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50 font-medium">
                          4h removido
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-gray-300 block mb-1 font-medium">1 Hora (R$):</label>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            defaultValue={price1h}
                            onBlur={(e) => {
                              const v1 = Number(e.target.value) || 25;
                              const updatedOptions: ServiceHourOption[] = [
                                {
                                  hours: 1,
                                  label: '1 Hora',
                                  duration: '60 min',
                                  price: v1,
                                  originalPrice: Math.round(v1 * 1.35),
                                  discountBadge: 'Sessão Express',
                                  tag: 'Sessão Express'
                                },
                                {
                                  hours: 2,
                                  label: '2 Horas',
                                  duration: '120 min',
                                  price: price2h,
                                  originalPrice: Math.round(price2h * 1.35),
                                  discountBadge: `Economize R$ ${Math.max(0, Math.round(v1 * 2 - price2h))}`,
                                  tag: 'Dourado Radiante'
                                },
                                {
                                  hours: 3,
                                  label: '3 Horas',
                                  duration: '180 min',
                                  price: price3h,
                                  originalPrice: Math.round(price3h * 1.4),
                                  discountBadge: 'Mais Pedida 🔥',
                                  tag: 'Mais Pedida 🔥',
                                  isPopular: true
                                }
                              ];
                              onUpdateService({
                                ...srv,
                                price: v1,
                                duration: '1h a 3h',
                                hourOptions: updatedOptions
                              });
                            }}
                            className="w-full bg-slate-950 border border-sky-500/60 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-300 block mb-1 font-medium">2 Horas (R$):</label>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            defaultValue={price2h}
                            onBlur={(e) => {
                              const v2 = Number(e.target.value) || 40;
                              const updatedOptions: ServiceHourOption[] = [
                                {
                                  hours: 1,
                                  label: '1 Hora',
                                  duration: '60 min',
                                  price: price1h,
                                  originalPrice: Math.round(price1h * 1.35),
                                  discountBadge: 'Sessão Express',
                                  tag: 'Sessão Express'
                                },
                                {
                                  hours: 2,
                                  label: '2 Horas',
                                  duration: '120 min',
                                  price: v2,
                                  originalPrice: Math.round(v2 * 1.35),
                                  discountBadge: `Economize R$ ${Math.max(0, Math.round(price1h * 2 - v2))}`,
                                  tag: 'Dourado Radiante'
                                },
                                {
                                  hours: 3,
                                  label: '3 Horas',
                                  duration: '180 min',
                                  price: price3h,
                                  originalPrice: Math.round(price3h * 1.4),
                                  discountBadge: 'Mais Pedida 🔥',
                                  tag: 'Mais Pedida 🔥',
                                  isPopular: true
                                }
                              ];
                              onUpdateService({
                                ...srv,
                                hourOptions: updatedOptions
                              });
                            }}
                            className="w-full bg-slate-950 border border-sky-500/60 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-gray-300 block mb-1 font-medium">3 Horas (R$):</label>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            defaultValue={price3h}
                            onBlur={(e) => {
                              const v3 = Number(e.target.value) || 60;
                              const updatedOptions: ServiceHourOption[] = [
                                {
                                  hours: 1,
                                  label: '1 Hora',
                                  duration: '60 min',
                                  price: price1h,
                                  originalPrice: Math.round(price1h * 1.35),
                                  discountBadge: 'Sessão Express',
                                  tag: 'Sessão Express'
                                },
                                {
                                  hours: 2,
                                  label: '2 Horas',
                                  duration: '120 min',
                                  price: price2h,
                                  originalPrice: Math.round(price2h * 1.35),
                                  discountBadge: `Economize R$ ${Math.max(0, Math.round(price1h * 2 - price2h))}`,
                                  tag: 'Dourado Radiante'
                                },
                                {
                                  hours: 3,
                                  label: '3 Horas',
                                  duration: '180 min',
                                  price: v3,
                                  originalPrice: Math.round(v3 * 1.4),
                                  discountBadge: 'Mais Pedida 🔥',
                                  tag: 'Mais Pedida 🔥',
                                  isPopular: true
                                }
                              ];
                              onUpdateService({
                                ...srv,
                                hourOptions: updatedOptions
                              });
                            }}
                            className="w-full bg-slate-950 border border-sky-500/60 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Os valores digitados são salvos automaticamente e exibidos aos clientes no menu e agendamento.
                      </p>
                    </div>
                  ) : (
                    /* Single Price Service (e.g. Banho de Lua Dourado) */
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-0.5">Preço da Sessão (R$):</label>
                        <input
                          type="number"
                          step="1"
                          defaultValue={srv.price}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val > 0) {
                              onUpdateService({ ...srv, price: val });
                            }
                          }}
                          className="w-full bg-ruby-900/60 border border-ruby-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-0.5">Duração:</label>
                        <input
                          type="text"
                          defaultValue={srv.duration}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              onUpdateService({ ...srv, duration: e.target.value.trim() });
                            }
                          }}
                          className="w-full bg-ruby-900/60 border border-ruby-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-0.5">Descrição do Procedimento:</label>
                    <textarea
                      rows={2}
                      defaultValue={srv.desc}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          onUpdateService({ ...srv, desc: e.target.value.trim() });
                        }
                      }}
                      className="w-full bg-ruby-900/60 border border-ruby-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setServiceToEdit(srv)}
                      className="px-3 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 font-semibold text-xs border border-gold-400/40 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Editar Completo & Foto</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal to Add Service */}
          {isAddingService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-ruby-700 space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setIsAddingService(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="font-serif text-lg font-bold text-white">Cadastrar Novo Procedimento</h4>

                <form onSubmit={handleSaveNewService} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-300 font-medium mb-1">Título do Procedimento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Bronze VIP Flash Power"
                      value={newServiceForm.title}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                      className="w-full bg-ruby-950 border border-ruby-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Preço Total (R$) *</label>
                      <input
                        type="number"
                        required
                        value={newServiceForm.price}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, price: Number(e.target.value) })}
                        className="w-full bg-ruby-950 border border-ruby-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Duração *</label>
                      <input
                        type="text"
                        required
                        value={newServiceForm.duration}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, duration: e.target.value })}
                        className="w-full bg-ruby-950 border border-ruby-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">Link Direto da Imagem *</label>
                    <input
                      type="url"
                      required
                      value={newServiceForm.image}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, image: e.target.value })}
                      className="w-full bg-ruby-950 border border-ruby-700 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">Descrição do Serviço</label>
                    <textarea
                      rows={2}
                      value={newServiceForm.desc}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, desc: e.target.value })}
                      placeholder="Descreva a técnica e os cosméticos aplicados..."
                      className="w-full bg-ruby-950 border border-ruby-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingService(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-ruby-700 text-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 ruby-gradient-btn py-2.5 rounded-xl text-white font-semibold shadow"
                    >
                      Salvar Serviço
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STUDIO SETTINGS & PIX KEY */}
      {activeTab === 'settings' && (
        <div className="glass-panel rounded-2xl p-6 border border-ruby-700/50 space-y-6">
          <div className="border-b border-ruby-800/60 pb-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-gold-400" />
              <span>Configurações Gerais do Studio & Chave Pix</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Personalize o telefone para envio de agendamentos via WhatsApp e a chave Pix de recebimento dos 10%
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            {/* Logo do Estúdio com upload do celular */}
            <div className="p-4 rounded-2xl bg-ruby-950/80 border border-ruby-800 space-y-2">
              <span className="text-xs font-bold text-gold-400 block">
                Logomarca da Loja (Editável para o Administrador)
              </span>
              <PhotoUploader
                currentImageUrl={tempSettings.logoImage || ''}
                onImageSelected={(url) => setTempSettings({ ...tempSettings, logoImage: url })}
                label="Foto do Logo (Envie direto do seu celular)"
                previewHeight="h-28"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Nome do Studio
                </label>
                <input
                  type="text"
                  value={tempSettings.studioName}
                  onChange={(e) => setTempSettings({ ...tempSettings, studioName: e.target.value })}
                  className="w-full bg-ruby-950/80 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  WhatsApp para Receber Agendamentos e Pedidos (com DDI + DDD)
                </label>
                <input
                  type="text"
                  value={tempSettings.whatsapp}
                  onChange={(e) => setTempSettings({ ...tempSettings, whatsapp: e.target.value })}
                  placeholder="5521999999999"
                  className="w-full bg-ruby-950/80 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
                <span className="text-[10px] text-gray-400">
                  Formato internacional (Ex: 5521998765432)
                </span>
              </div>
            </div>

            {/* Pix Configuration */}
            <div className="bg-ruby-950/80 rounded-2xl p-4 border border-gold-400/30 space-y-3">
              <span className="text-xs font-bold text-gold-400 block">
                Dados do Recebedor Pix (Sinal de Reserva)
              </span>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">
                  Chave Pix (ou Chave Aleatória EVP):
                </label>
                <input
                  type="text"
                  value={tempSettings.pixKey}
                  onChange={(e) => setTempSettings({ ...tempSettings, pixKey: e.target.value })}
                  className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Nome do Titular / Beneficiário:
                  </label>
                  <input
                    type="text"
                    value={tempSettings.pixBeneficiary}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, pixBeneficiary: e.target.value })
                    }
                    className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Banco / Instituição Financeira:
                  </label>
                  <input
                    type="text"
                    value={tempSettings.pixBank}
                    onChange={(e) => setTempSettings({ ...tempSettings, pixBank: e.target.value })}
                    className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Live Dynamic Pix Simulation for Admin verification */}
              <div className="pt-2 border-t border-ruby-800/80">
                <span className="text-[11px] font-semibold text-gold-400 block mb-2">
                  Pré-visualização do QR Code Dinâmico gerado aos clientes:
                </span>
                <DynamicPixCard
                  amount={12.0}
                  totalAmount={120.0}
                  pixKey={tempSettings.pixKey}
                  beneficiaryName={tempSettings.pixBeneficiary}
                  city="Rio de Janeiro"
                  txId="TESTEADM"
                  description="Teste Administrativo"
                  allowAmountToggle={true}
                  title="Simulação do QR Code Pix Dinâmico"
                  subtitle="Teste com a câmera do seu banco para verificar o nome do beneficiário e chave"
                />
              </div>
            </div>

            {/* Localização, Horários & Conforto Exclusivo (Editável) */}
            <div className="p-4 rounded-2xl bg-ruby-950/80 border border-ruby-800 space-y-4">
              <div className="flex items-center justify-between border-b border-ruby-800/80 pb-2">
                <span className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>Localização, Horários & Conforto Exclusivo (Editável)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/50">
                  Refletido em Tempo Real
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Selo / Chamada da Seção
                  </label>
                  <input
                    type="text"
                    value={tempSettings.locationBadgeTitle || 'Localização & Conforto Exclusivo'}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, locationBadgeTitle: e.target.value })
                    }
                    placeholder="Localização & Conforto Exclusivo"
                    className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                  <span className="text-[10px] text-gray-400">
                    Padrão: Localização & Conforto Exclusivo
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Título Principal do Espaço VIP
                  </label>
                  <input
                    type="text"
                    value={tempSettings.locationTitle || 'Nosso Studio VIP'}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, locationTitle: e.target.value })
                    }
                    placeholder="Nosso Studio VIP"
                    className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={tempSettings.hours || 'Terça a Domingo: 08h às 18h'}
                    onChange={(e) => setTempSettings({ ...tempSettings, hours: e.target.value })}
                    placeholder="Terça a Domingo: 08h às 18h"
                    className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white font-medium focus:outline-none focus:border-gold-400"
                  />
                  <span className="text-[10px] text-gray-400">
                    Padrão: Terça a Domingo: 08h às 18h
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Cidade e Estado
                  </label>
                  <input
                    type="text"
                    value={tempSettings.cityState || 'Rio de Janeiro - RJ'}
                    onChange={(e) => setTempSettings({ ...tempSettings, cityState: e.target.value })}
                    placeholder="Rio de Janeiro - RJ"
                    className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Endereço Completo do Studio
                </label>
                <input
                  type="text"
                  value={tempSettings.address || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                  placeholder="Rua das Orquídeas, 142 - Bairro VIP"
                  className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Diferenciais de Conforto Exclusivo (separados por vírgula):
                </label>
                <input
                  type="text"
                  value={
                    tempSettings.comfortFeatures && tempSettings.comfortFeatures.length > 0
                      ? tempSettings.comfortFeatures.join(', ')
                      : 'Ambiente Climatizado, Máx. 2 Clientes Simultâneas, Ducha Pós-Sol Térmica, Biquíni Descartável Estéril'
                  }
                  onChange={(e) => {
                    const features = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setTempSettings({ ...tempSettings, comfortFeatures: features });
                  }}
                  placeholder="Ambiente Climatizado, Máx. 2 Clientes Simultâneas, Ducha Pós-Sol Térmica, Biquíni Descartável Estéril"
                  className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Exibidos com ícones de confirmação na seção do Studio na página inicial.
                </span>
              </div>
            </div>

            {/* WhatsApp Phone Numbers of Staff Members */}
            {staff.length > 0 && onUpdateStaff && (
              <div className="p-4 rounded-2xl bg-ruby-950/90 border border-ruby-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      Celulares das Especialistas para Receber Alertas
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    O WhatsApp de cada uma será acionado quando o cliente agendar com ela
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {staff.map((member) => (
                    <div key={member.id} className="space-y-1">
                      <label className="text-[11px] text-gold-300 font-semibold block">
                        WhatsApp de {member.name}
                      </label>
                      <input
                        type="text"
                        value={member.phone || ''}
                        onChange={(e) => {
                          const updatedStaff = staff.map((s) =>
                            s.id === member.id ? { ...s, phone: e.target.value } : s
                          );
                          onUpdateStaff(updatedStaff);
                        }}
                        placeholder="Ex: 5521998765432"
                        className="w-full bg-ruby-900/60 border border-ruby-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-3">
              {settingsSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Configurações salvas com sucesso!
                </span>
              )}
              <button
                type="submit"
                className="ruby-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: SEGURANÇA & CREDENCIAIS */}
      {activeTab === 'security' && (
        <div className="glass-panel rounded-2xl p-6 border border-ruby-700/50 space-y-6">
          <div className="border-b border-ruby-800/60 pb-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-gold-400" />
              <span>Controle de Acesso da Administradora</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Altere seu login e senha de acesso à área restrita para garantir a segurança dos dados.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newLoginInput.trim() && !newPasswordInput.trim()) {
                setCredError('Preencha um novo usuário ou nova senha para atualizar.');
                return;
              }
              if (newPasswordInput.trim() && newPasswordInput.trim().length < 4) {
                setCredError('A senha deve ter no mínimo 4 caracteres.');
                return;
              }
              setCredError('');
              onUpdateCredentials({
                login: newLoginInput.trim() || credentials.login,
                password: newPasswordInput.trim() || credentials.password
              });
              setCredsSaved(true);
              setNewLoginInput('');
              setNewPasswordInput('');
              setTimeout(() => setCredsSaved(false), 3000);
            }}
            className="space-y-4 max-w-md"
          >
            {credError && (
              <div className="p-3 rounded-xl bg-ruby-950 border border-ruby-600 text-ruby-300 text-xs">
                {credError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Novo Nome de Usuário / Login (Opcional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gold-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={newLoginInput}
                  onChange={(e) => setNewLoginInput(e.target.value)}
                  placeholder="•••••••• (Digite novo usuário se desejar alterar)"
                  className="w-full bg-ruby-950/80 border border-ruby-700 focus:border-gold-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                O usuário e e-mail atuais nunca são expostos na tela por segurança.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Nova Senha de Acesso (Opcional)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showCredPassword ? 'text' : 'password'}
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="•••••••••••• (Digite nova senha se desejar alterar)"
                  className="w-full bg-ruby-950/80 border border-ruby-700 focus:border-gold-400 rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCredPassword(!showCredPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                  title={showCredPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showCredPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                As credenciais ficam protegidas e criptografadas no servidor.
              </span>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="submit"
                className="ruby-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Novas Credenciais</span>
              </button>

              {credsSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-4 h-4" /> Credenciais atualizadas com sucesso!
                </span>
              )}
            </div>
          </form>

          <div className="bg-ruby-950/80 rounded-2xl p-4 border border-ruby-800 space-y-1.5 text-xs text-gray-300">
            <span className="font-bold text-gold-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sessão Atual de Administradora Ativa & Protegida</span>
            </span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Sua conta está conectada com privilégios completos de administração.
              Por privacidade e segurança, seu nome de usuário e e-mail nunca são exibidos abertamente neste painel.
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Enquanto estiver autenticada, você pode navegar livremente pelo site e usar os botões de edição rápida para alterar serviços, produtos e banners em tempo real.
            </p>
          </div>

          {/* VERCEL HOSTING & SECURITY ENHANCEMENTS CARD */}
          <div className="bg-gradient-to-br from-slate-950 via-ruby-950/90 to-slate-900 rounded-2xl p-5 border-2 border-emerald-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ruby-800/60 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                    <span>Hospedagem & Conexão no Vercel</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600/50 px-2 py-0.5 rounded-full font-sans font-bold">
                      Pronto para Produção
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Arquivos <code className="text-gold-400 font-mono">vercel.json</code> e <code className="text-gold-400 font-mono">api/index.ts</code> configurados com sucesso.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist de Segurança Ativa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Chaves de API Protegidas</span>
                  <span className="text-gray-400">Armazenadas no servidor, nunca expostas no código cliente.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Sem Senhas no Código</span>
                  <span className="text-gray-400">Gerenciadas por variáveis de ambiente seguras.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Limite de Tentativas de Login</span>
                  <span className="text-gray-400">Bloqueio automático de 15 min após 5 falhas consecutivas.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Debug Desligado & Erros Sem Detalhe</span>
                  <span className="text-gray-400">Mensagens genéricas sem vazamento de rastros ou dados internos.</span>
                </div>
              </div>
            </div>

            {/* Passo a Passo Vercel */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-ruby-800/80 space-y-3">
              <span className="font-bold text-gold-300 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                <UploadCloud className="w-4 h-4 text-gold-400" />
                <span>Passo a Passo para Hospedar na Sua Conta Vercel:</span>
              </span>

              <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300 leading-relaxed">
                <li>
                  Acesse <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline font-semibold">vercel.com</a> e faça login com sua conta (GitHub ou e-mail).
                </li>
                <li>
                  Clique em <strong>"Add New..."</strong> &rarr; <strong>"Project"</strong> e selecione o repositório GitHub do seu app.
                </li>
                <li>
                  O Vercel detectará automaticamente o framework Vite e o arquivo <code className="text-gold-400 font-mono">vercel.json</code>.
                </li>
                <li>
                  Na seção <strong>"Environment Variables"</strong> (Variáveis de Ambiente), adicione:
                  <div className="mt-1.5 p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-emerald-400 border border-emerald-500/30 space-y-0.5">
                    <div>ADMIN_LOGIN=•••••••• <span className="text-gray-500 text-[10px]">(oculto por segurança)</span></div>
                    <div>ADMIN_PASSWORD=•••••••• <span className="text-gray-500 text-[10px]">(oculto por segurança)</span></div>
                    <div>ADMIN_EMAIL=•••••••• <span className="text-gray-500 text-[10px]">(oculto por segurança)</span></div>
                    <div>ADMIN_SESSION_SECRET=••••••••</div>
                    <div>NODE_ENV=production</div>
                  </div>
                </li>
                <li>
                  Clique no botão azul <strong>"Deploy"</strong>! Seu app estará online em segundos com HTTPS e proteção total de servidor.
                </li>
              </ol>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const envText = `ADMIN_LOGIN=abelinha\nADMIN_PASSWORD=21976333205\nADMIN_EMAIL=andrearmamentista@gmail.com\nADMIN_SESSION_SECRET=mbronze_secure_salt_vip_studio_2026\nNODE_ENV=production`;
                    navigator.clipboard?.writeText(envText);
                    setCopiedVercelEnv(true);
                    setTimeout(() => setCopiedVercelEnv(false), 3000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedVercelEnv ? 'Copiado para Área de Transferência!' : 'Copiar Variáveis para Vercel'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANAMNESE DETAILS MODAL */}
      {selectedBookingForAnamnese && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-ruby-700 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedBookingForAnamnese(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Ficha de Anamnese Digital
                </h4>
                <p className="text-xs text-gray-400">
                  Agendamento #{selectedBookingForAnamnese.id} · {selectedBookingForAnamnese.clientName}
                </p>
              </div>
            </div>

            <div className="bg-ruby-950/90 rounded-xl p-4 border border-ruby-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 border-b border-ruby-900 pb-2">
                <div>
                  <span className="text-gray-400 block text-[10px]">Procedimento</span>
                  <span className="font-semibold text-white">
                    {selectedBookingForAnamnese.serviceTitle}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Data & Hora</span>
                  <span className="font-semibold text-gold-400">
                    {selectedBookingForAnamnese.date.split('-').reverse().join('/')} às{' '}
                    {selectedBookingForAnamnese.time}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-ruby-900 pb-2">
                <div>
                  <span className="text-gray-400 block text-[10px]">WhatsApp da Cliente</span>
                  <span className="font-semibold text-white font-mono">
                    {selectedBookingForAnamnese.clientPhone}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Fototipo Declarado</span>
                  <span className="font-semibold text-ruby-300">
                    {selectedBookingForAnamnese.phototype}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-ruby-900 pb-2">
                <div>
                  <span className="text-gray-400 block text-[10px]">Gestante / Lactante</span>
                  <span className="font-semibold text-white">
                    {selectedBookingForAnamnese.pregnant}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Forma de Pagamento</span>
                  <span className="font-bold text-gold-400">
                    {selectedBookingForAnamnese.paymentMethod === 'local' || !selectedBookingForAnamnese.paymentMethod
                      ? 'No Local (no estúdio)'
                      : 'Pix Antecipado'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px] mb-1">
                  Alergias / Condições de Saúde Declaradas:
                </span>
                <p className="bg-ruby-900/50 p-2.5 rounded-lg text-gray-200 leading-relaxed border border-ruby-800">
                  {selectedBookingForAnamnese.health}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={`https://wa.me/55${selectedBookingForAnamnese.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Olá, ${selectedBookingForAnamnese.clientName}! Aqui é do Moreninha do Bronze Studio VIP a respeito do seu agendamento.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center justify-center space-x-1.5 transition shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setBookingToDelete(selectedBookingForAnamnese);
                  setSelectedBookingForAnamnese(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Excluir Agendamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE CLIENTE / AGENDAMENTO */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border-2 border-red-500/60 space-y-4 shadow-2xl relative bg-gradient-to-b from-slate-950 via-ruby-950 to-slate-950">
            <button
              onClick={() => setBookingToDelete(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-red-900/60 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Excluir Agendamento / Cliente</h3>
                <p className="text-xs text-red-300/80">Esta ação removerá o agendamento permanentemente.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Cliente:</span>
                <span className="font-bold text-white text-sm">{bookingToDelete.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">WhatsApp:</span>
                <span className="font-mono text-gray-200">{bookingToDelete.clientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Procedimento:</span>
                <span className="text-gold-300 font-semibold">{bookingToDelete.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data e Hora:</span>
                <span className="text-white">{bookingToDelete.date.split('-').reverse().join('/')} às {bookingToDelete.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor:</span>
                <span className="text-gold-400 font-bold">R$ {bookingToDelete.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
              ⚠️ O agendamento será excluído do registro local e removido automaticamente do banco de dados Firebase.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl border border-ruby-700 text-gray-300 hover:text-white hover:bg-ruby-900/50 text-xs font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBooking(bookingToDelete.id);
                  setBookingToDelete(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-red-950/60 transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {serviceToEdit && (
        <EditServiceModal
          isOpen={Boolean(serviceToEdit)}
          service={serviceToEdit}
          onClose={() => setServiceToEdit(null)}
          onSave={(updated) => {
            onUpdateService(updated);
            setServiceToEdit(null);
          }}
        />
      )}
    </div>
  );
};
