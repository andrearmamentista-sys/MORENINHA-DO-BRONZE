import { Service, BoutiqueProduct, Booking, StudioSettings, StaffMember } from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Mariana Guedes',
    role: 'Personal Bronze Master',
    specialty: 'Fita Milimétrica & Ativação Rápida de Melanina',
    bio: 'Mais de 8 anos transformando a autoestima de mulheres com marquinhas impecáveis e simétricas.',
    phone: '5521998765432',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'staff-2',
    name: 'Camila Souza',
    role: 'Bronze Stylist & Terapeuta Corporal',
    specialty: 'Pelos Dourados, Banho de Lua & Bronze Sem Sol (Jet)',
    bio: 'Especialista em peles sensíveis e hidratação profunda pós-sol para fixação máxima da cor.',
    phone: '5521991234567',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Bronze Marquinha VIP (Fita)',
    duration: '1h a 3h',
    price: 25.0,
    desc: 'Montagem de biquíni de fita personalizada com aceleradores de bronzeamento de alta performance para uma marquinha impecável.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Fita milimetricamente ajustada ao seu corpo',
      'Ativador importado de melanina',
      'Hidratação pós-sol profunda inclusa',
      'Desconto progressivo por hora de bronze'
    ],
    phototypeRecommended: 'Fototipo II, III, IV e V',
    hourOptions: [
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
    ]
  },
  {
    id: 'srv-4',
    title: 'Banho de Lua Dourado',
    duration: '40 min',
    price: 50.0,
    desc: 'Descoloração dos pelos sem ardência nem pinicação, acompanhada de esfoliação corporal aromática e hidratação profunda iluminadora.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Pelos ultra dourados e macios',
      'Remoção de células mortas e impurezas',
      'Toque aveludado acetinado'
    ],
    phototypeRecommended: 'Todos os tipos de pele'
  }
];

export const INITIAL_PRODUCTS: BoutiqueProduct[] = [
  {
    id: 'prod-1',
    name: 'Óleo Acelerador Iluminador Gold 24k',
    price: 65.0,
    originalPrice: 89.0,
    category: 'Bronze & Brilho',
    desc: 'Partículas de ouro vegetal e óleo de coco para acelerar a cor e iluminar a marquinha com brilho radiante imediato.',
    image: 'https://images.unsplash.com/photo-1608248597261-8332580476a0?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    badge: '🔥 Mais Vendido',
    highlight: true
  },
  {
    id: 'prod-2',
    name: 'Gel Hidratante Pós-Sol Calmante Refrescante',
    price: 45.0,
    originalPrice: 60.0,
    category: 'Pós-Bronze',
    desc: 'Formulado com Aloe Vera pura, Camomila e D-Pantenol. Refresca instantaneamente, acalma e prolonga a cor da marquinha.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    badge: '🌿 Aloe Vera 100%'
  },
  {
    id: 'prod-3',
    name: 'Perfume Sensual de Calcinha Pheromones',
    price: 42.0,
    originalPrice: 58.0,
    category: 'Sensual & Aromas',
    desc: 'Fragrância afrodisíaca irresistível com feromônios para borrifar na lingerie ou roupa íntima com fixação de até 24h.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    badge: '💋 Feromônios VIP',
    highlight: true
  },
  {
    id: 'prod-4',
    name: 'Gel Mágico Beijável Aromático Térmico',
    price: 35.0,
    originalPrice: 48.0,
    category: 'Sensual & Intimidade',
    desc: 'Gel corporal aromatizado 100% beijável com efeito térmico suave (aquece ao soprar). Sabores afrodisíacos irresistíveis.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    badge: '🔞 100% Beijável'
  },
  {
    id: 'prod-5',
    name: 'Biquíni de Fita Metálico & Neon VIP (Kit)',
    price: 55.0,
    originalPrice: 75.0,
    category: 'Acessórios VIP',
    desc: 'Fitas estilizadas elásticas metalizadas com adesão hipoalergênica para compor marquinhas desenhadas e fotos deslumbrantes.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    badge: '✨ Lançamento VIP'
  },
  {
    id: 'prod-6',
    name: 'Shimmer Body Glow Iluminador de Marquinha',
    price: 49.0,
    originalPrice: 69.0,
    category: 'Bronze & Brilho',
    desc: 'Bruma corporal com micropartículas holográficas douradas que realçam o contraste da marquinha em festas e ensaios.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    badge: '⭐ Brilho 24k'
  }
];

export const INITIAL_SETTINGS: StudioSettings = {
  studioName: 'Moreninha do Bronze',
  subtitle: 'Studio VIP & Boutique Exclusiva',
  heroTitle: 'Sua marquinha perfeita com o luxo e o cuidado que você merece.',
  heroDesc: 'Procedimentos personalizados com fita milimétrica, aceleradores importados e acompanhamento rigoroso por fototipo de pele. Agende seu horário com pagamento no local no dia do atendimento e preencha sua anamnese digital em menos de 1 minuto.',
  whatsapp: '5521998765432',
  pixKey: '00020126580014BR.GOV.BCB.PIX0136moreninhabronze-pix-oficial-12345',
  pixKeyType: 'Chave Aleatória (EVP)',
  pixBeneficiary: 'Mariana Guedes Bronze Studio ME',
  pixBank: 'Nubank / PagSeguro',
  address: 'Rua das Orquídeas, 142 - Bairro VIP',
  cityState: 'Rio de Janeiro - RJ',
  hours: 'Terça a Domingo: 08h às 18h',
  masterName: 'Mariana Guedes',
  masterRole: 'Personal Bronze Master',
  masterBio: 'Especialista em Bronzeamento Natural, Fita Personalizada e Cuidados com a Pele. Mais de 8 anos transformando a autoestima de mulheres com marquinhas impecáveis.',
  masterImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  heroImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  servicesTitle: 'Técnicas de Bronzeamento Personalizado',
  servicesSubtitle: 'Menu de Procedimentos',
  boutiqueTitle: 'Boutique Sensual & Acessórios',
  boutiqueSubtitle: 'Produtos Exclusivos para seu Autocuidado',
  studioTitle: 'Nossas Profissionais do Bronze',
  studioSubtitle: 'Equipe Especializada & Espaço VIP',
  guideTitle: 'Protocolo de Preparação e Cuidados com o Bronze',
  btnServicesText: 'Conhecer Procedimentos',
  btnBoutiqueText: 'Boutique Sensual',
  btnBuyText: 'Comprar',
  themePrimaryColor: 'blue',
  themeTextColor: '#ffffff',
  themeBgColor: '#07152b'
};

export const INITIAL_ADMIN_CREDENTIALS = {
  login: 'abelinha',
  password: '21976333205'
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1718201',
    serviceId: 'srv-1',
    serviceTitle: 'Bronze Marquinha VIP (Fita)',
    professionalId: 'staff-1',
    professionalName: 'Mariana Guedes',
    date: '2026-10-02',
    time: '09:00',
    clientName: 'Fernanda Caroline Silva',
    clientPhone: '(21) 98844-1234',
    phototype: 'Pele Clara / Morena Clara (Tipo III)',
    pregnant: 'Não',
    health: 'Nenhuma alergia relatada.',
    total: 120.0,
    paymentMethod: 'local',
    status: 'confirmado',
    createdAt: '01/10/2026'
  },
  {
    id: 'BK-1718202',
    serviceId: 'srv-2',
    serviceTitle: 'Bronze Gel Turbo Acelerado',
    professionalId: 'staff-2',
    professionalName: 'Camila Souza',
    date: '2026-10-02',
    time: '11:00',
    clientName: 'Beatriz Vasconcelos',
    clientPhone: '(21) 97722-5588',
    phototype: 'Pele Morena Escura (Tipo IV/V)',
    pregnant: 'Não',
    health: 'Pele levemente sensível a produtos com canela.',
    total: 150.0,
    paymentMethod: 'local',
    status: 'agendado',
    createdAt: '01/10/2026'
  },
  {
    id: 'BK-1718203',
    serviceId: 'srv-3',
    serviceTitle: 'Bronze Jet/Neon (Sem Sol)',
    professionalId: 'staff-1',
    professionalName: 'Mariana Guedes',
    date: '2026-10-03',
    time: '14:30',
    clientName: 'Juliana Mendes Lima',
    clientPhone: '(21) 99123-4567',
    phototype: 'Pele Muito Clara (Tipo I/II)',
    pregnant: 'Não',
    health: 'Evento de casamento no fim de semana.',
    total: 180.0,
    paymentMethod: 'pix',
    status: 'confirmado',
    createdAt: '01/10/2026'
  }
];
