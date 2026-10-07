export interface ServiceHourOption {
  hours: number;
  label: string; // '1 Hora', '2 Horas', '3 Horas', '4 Horas'
  duration: string; // '60 min', '120 min', etc.
  price: number;
  originalPrice: number;
  discountBadge: string;
  tag?: string;
  isPopular?: boolean;
}

export interface Service {
  id: string;
  title: string;
  duration: string;
  price: number;
  desc: string;
  image: string;
  benefits?: string[];
  phototypeRecommended?: string;
  hourOptions?: ServiceHourOption[];
  selectedHours?: number;
}

export interface BoutiqueProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  desc?: string;
  inStock?: boolean;
  badge?: string;
  highlight?: boolean;
}

export interface CartItem {
  product: BoutiqueProduct;
  qty: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialty: string;
  phone?: string;
}

export type BookingStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
export type PaymentMethod = 'local' | 'pix';

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  professionalId?: string;
  professionalName?: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  phototype: string;
  pregnant: string;
  health: string;
  total: number;
  paymentMethod: PaymentMethod;
  signal?: number;
  status: BookingStatus;
  createdAt: string;
  userId?: string;
}

export interface StudioSettings {
  studioName: string;
  subtitle: string;
  logoImage?: string;
  heroTitle?: string;
  heroDesc?: string;
  whatsapp: string;
  pixKey: string;
  pixKeyType: string;
  pixBeneficiary: string;
  pixBank: string;
  address: string;
  cityState: string;
  hours: string;
  masterName: string;
  masterRole: string;
  masterBio: string;
  masterImage: string;
  heroImage: string;
  // Custom texts & colors
  servicesTitle?: string;
  servicesSubtitle?: string;
  boutiqueTitle?: string;
  boutiqueSubtitle?: string;
  studioTitle?: string;
  studioSubtitle?: string;
  guideTitle?: string;
  btnServicesText?: string;
  btnBoutiqueText?: string;
  btnBuyText?: string;
  themePrimaryColor?: string;
  themeTextColor?: string;
  themeBgColor?: string;
  locationBadgeTitle?: string;
  locationTitle?: string;
  comfortFeatures?: string[];
  customClientMessageTemplate?: string;
  customStaffMessageTemplate?: string;
}

export interface AdminCredentials {
  login: string;
  password: string;
}

export type ViewTab = 'catalog' | 'booking' | 'admin';
