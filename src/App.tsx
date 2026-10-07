import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdminBar } from './components/AdminBar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProfessionalAndStudio } from './components/ProfessionalAndStudio';
import { TanningGuide } from './components/TanningGuide';
import { BoutiqueSection } from './components/BoutiqueSection';
import { BookingWizard } from './components/BookingWizard';
import { CartDrawer } from './components/CartDrawer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DirectImageModal } from './components/DirectImageModal';
import { EditServiceModal } from './components/EditServiceModal';
import { EditProductModal } from './components/EditProductModal';
import { EditHeroModal } from './components/EditHeroModal';
import { EditLogoModal } from './components/EditLogoModal';
import { ThemeAndTextCustomizerModal } from './components/ThemeAndTextCustomizerModal';
import { EditMessagesModal } from './components/EditMessagesModal';
import { EditStaffModal } from './components/EditStaffModal';
import { StudioLocationSection } from './components/StudioLocationSection';
import { FloatingWhatsAppConcierge } from './components/FloatingWhatsAppConcierge';
import { MascotWidget } from './components/MascotWidget';
import { MascotSpotlight } from './components/MascotSpotlight';
import { AnimatedMarquee } from './components/AnimatedMarquee';
import { QuickPixModal } from './components/QuickPixModal';
import { Footer } from './components/Footer';
import { applyThemeToDocument } from './utils/themeEngine';

import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType
} from './firebase';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';

import {
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_BOOKINGS,
  INITIAL_ADMIN_CREDENTIALS,
  INITIAL_STAFF
} from './data/initialData';
import {
  Service,
  BoutiqueProduct,
  Booking,
  StudioSettings,
  StaffMember,
  CartItem,
  ViewTab,
  BookingStatus,
  AdminCredentials
} from './types';

export default function App() {
  // Services & Products with localStorage & Firestore sync
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('mbronze_services');
    if (!saved) return INITIAL_SERVICES;
    try {
      const parsed: Service[] = JSON.parse(saved);
      const filtered = parsed.filter(
        (s) =>
          s.id === 'srv-1' ||
          s.id === 'srv-4' ||
          s.title.toLowerCase().includes('marquinha') ||
          s.title.toLowerCase().includes('lua')
      );
      return filtered.length > 0 ? filtered : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [products, setProducts] = useState<BoutiqueProduct[]>(() => {
    const saved = localStorage.getItem('mbronze_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('mbronze_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [settings, setSettings] = useState<StudioSettings>(() => {
    const saved = localStorage.getItem('mbronze_settings');
    const base: StudioSettings = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    if (!base.pixKey || base.pixKey.includes('moreninhabronze-pix-oficial')) {
      base.pixKey = '21976333205';
      base.pixKeyType = 'Telefone Celular';
      base.pixBeneficiary = 'Moreninha do Bronze';
    }
    if (!base.locationBadgeTitle) {
      base.locationBadgeTitle = 'Localização & Conforto Exclusivo';
    }
    if (!base.hours) {
      base.hours = 'Terça a Domingo: 08h às 18h';
    }
    if (!base.comfortFeatures || base.comfortFeatures.length === 0) {
      base.comfortFeatures = [
        'Ambiente Climatizado',
        'Máx. 2 Clientes Simultâneas',
        'Ducha Pós-Sol Térmica',
        'Biquíni Descartável Estéril'
      ];
    }
    try {
      localStorage.setItem('mbronze_settings', JSON.stringify(base));
    } catch {
      // ignore
    }
    return base;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const deletedRaw = localStorage.getItem('mbronze_deleted_booking_ids');
      const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      const saved = localStorage.getItem('mbronze_bookings');
      if (saved !== null) {
        const parsed: Booking[] = JSON.parse(saved);
        return parsed.filter((b) => !deletedIds.has(b.id));
      }
      return INITIAL_BOOKINGS.filter((b) => !deletedIds.has(b.id));
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mbronze_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Credentials & Authentication with localStorage persistence
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem('mbronze_admin_creds');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_CREDENTIALS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mbronze_admin_session') === 'true';
  });

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<ViewTab>('catalog');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [preselectedStaffId, setPreselectedStaffId] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // In-App Editing Modals State (Strictly for authenticated admin)
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<BoutiqueProduct | null>(null);
  const [isEditHeroOpen, setIsEditHeroOpen] = useState(false);
  const [isEditLogoOpen, setIsEditLogoOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [isEditMessagesOpen, setIsEditMessagesOpen] = useState(false);
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);

  // Direct Image Modal State with Name and Caption fields
  const [imageModalConfig, setImageModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    currentUrl: string;
    defaultUrl: string;
    currentCaption?: string;
    captionLabel?: string;
    currentName?: string;
    nameLabel?: string;
    onSave: (url: string, caption?: string, name?: string) => void;
  }>({
    isOpen: false,
    title: '',
    currentUrl: '',
    defaultUrl: '',
    currentCaption: '',
    captionLabel: 'Legenda / Texto Descritivo:',
    currentName: '',
    nameLabel: undefined,
    onSave: () => {}
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial Firestore test & Auth listener
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const email = user.email.toLowerCase();
        if (email === 'andrearmamentista@gmail.com') {
          setIsAdminAuthenticated(true);
          localStorage.setItem('mbronze_admin_session', 'true');
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Firestore Real-time Listeners with local fallback
  useEffect(() => {
    // Settings listener
    const settingsDocRef = doc(db, 'settings', 'main');
    const unsubSettings = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings((prev) => ({ ...prev, ...(docSnap.data() as StudioSettings) }));
        }
      },
      (error) => {
        console.warn('Settings listener fallback to local:', error.message);
      }
    );

    // Services listener
    const servicesCol = collection(db, 'services');
    const unsubServices = onSnapshot(
      servicesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Service[] = [];
          snapshot.forEach((d) => list.push(d.data() as Service));
          const filtered = list.filter(
            (s) =>
              s.id === 'srv-1' ||
              s.id === 'srv-4' ||
              s.title.toLowerCase().includes('marquinha') ||
              s.title.toLowerCase().includes('lua')
          );
          setServices(filtered.length > 0 ? filtered : INITIAL_SERVICES);
        }
      },
      (error) => {
        console.warn('Services listener fallback to local:', error.message);
      }
    );

    // Products listener
    const productsCol = collection(db, 'products');
    const unsubProducts = onSnapshot(
      productsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: BoutiqueProduct[] = [];
          snapshot.forEach((d) => list.push(d.data() as BoutiqueProduct));
          setProducts(list);
        }
      },
      (error) => {
        console.warn('Products listener fallback to local:', error.message);
      }
    );

    // Staff listener
    const staffCol = collection(db, 'staff');
    const unsubStaff = onSnapshot(
      staffCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: StaffMember[] = [];
          snapshot.forEach((d) => list.push(d.data() as StaffMember));
          setStaff(list);
        }
      },
      (error) => {
        console.warn('Staff listener fallback to local:', error.message);
      }
    );

    // Bookings listener
    const bookingsCol = collection(db, 'bookings');
    const unsubBookings = onSnapshot(
      bookingsCol,
      (snapshot) => {
        const deletedRaw = localStorage.getItem('mbronze_deleted_booking_ids');
        const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
        if (!snapshot.empty) {
          const list: Booking[] = [];
          snapshot.forEach((d) => {
            const item = d.data() as Booking;
            if (!deletedIds.has(item.id)) {
              list.push(item);
            }
          });
          setBookings(list);
        }
      },
      (error) => {
        console.warn('Bookings listener fallback to local:', error.message);
      }
    );

    return () => {
      unsubSettings();
      unsubServices();
      unsubProducts();
      unsubStaff();
      unsubBookings();
    };
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('mbronze_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('mbronze_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mbronze_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('mbronze_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mbronze_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('mbronze_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mbronze_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('mbronze_admin_session', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Apply customizable theme background, colors & shades dynamically to root
  useEffect(() => {
    applyThemeToDocument(
      settings.themeBgColor || '#07152b',
      settings.themeTextColor || '#ffffff',
      settings.themePrimaryColor || 'blue'
    );
  }, [settings.themeBgColor, settings.themeTextColor, settings.themePrimaryColor]);

  // Cart Handlers
  const handleAddToCart = (product: BoutiqueProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
    showToast(`"${product.name}" adicionado à sacola!`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Booking Flow Handlers
  const handleStartBooking = (service: Service) => {
    setSelectedServiceForBooking(service);
    setPreselectedStaffId(staff[0]?.id);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBookingWithStaff = (staffMember: StaffMember) => {
    setSelectedServiceForBooking(services[0] || null);
    setPreselectedStaffId(staffMember.id);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelBooking = () => {
    setSelectedServiceForBooking(null);
    setCurrentTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = async (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Persist to Firestore
    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (error) {
      console.warn('Firestore booking write notice:', error);
    }

    setSelectedServiceForBooking(null);
    setCurrentTab('catalog');
    showToast('Agendamento realizado com sucesso! Marquinha VIP reservada.');
  };

  // Admin Auth Handlers
  const handleOpenAdminAuth = () => {
    setIsAdminAuthOpen(true);
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthOpen(false);
    setCurrentTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Bem-vinda, administradora! Modo de edição liberado.');
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userEmail = (result.user.email || '').toLowerCase();
        if (userEmail === 'andrearmamentista@gmail.com') {
          setIsAdminAuthenticated(true);
          localStorage.setItem('mbronze_admin_session', 'true');
          setIsAdminAuthOpen(false);
          setCurrentTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Bem-vinda, administradora! Painel VIP liberado.');
        } else {
          await signOut(auth);
          showToast('Acesso negado: Esta conta não possui autorização de administradora.');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showToast('Erro ao autenticar com o Google.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setIsAdminAuthenticated(false);
    localStorage.removeItem('mbronze_admin_session');
    setCurrentTab('catalog');
    showToast('Sessão de administradora encerrada com sucesso.');
  };

  // In-App Direct Editing Handlers (Strictly Admin)
  const handleSaveService = async (updated: Service) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === updated.id);
      if (exists) {
        return prev.map((s) => (s.id === updated.id ? updated : s));
      }
      return [updated, ...prev];
    });
    setEditingService(null);

    try {
      await setDoc(doc(db, 'services', updated.id), updated);
    } catch (err) {
      console.warn('Firestore service sync notice:', err);
    }

    showToast(`Procedimento "${updated.title}" salvo com sucesso!`);
  };

  const handleDeleteService = async (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setEditingService(null);

    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (err) {
      console.warn('Firestore service delete notice:', err);
    }

    showToast('Procedimento excluído com sucesso.');
  };

  const handleSaveProduct = async (updated: BoutiqueProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p));
      }
      return [updated, ...prev];
    });
    setEditingProduct(null);

    try {
      await setDoc(doc(db, 'products', updated.id), updated);
    } catch (err) {
      console.warn('Firestore product sync notice:', err);
    }

    showToast(`Produto "${updated.name}" salvo na boutique!`);
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setEditingProduct(null);

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore product delete notice:', err);
    }

    showToast('Produto excluído da boutique.');
  };

  const handleSaveStaffMember = async (updatedStaff: StaffMember) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
    setEditingStaffMember(null);

    try {
      await setDoc(doc(db, 'staff', updatedStaff.id), updatedStaff);
    } catch (err) {
      console.warn('Firestore staff sync notice:', err);
    }

    showToast(`Dados da profissional "${updatedStaff.name}" atualizados com sucesso!`);
  };

  const handleSaveHero = async (updated: Partial<StudioSettings>) => {
    const newSettings: StudioSettings = {
      ...settings,
      heroTitle: updated.heroTitle ?? settings.heroTitle,
      heroDesc: updated.heroDesc ?? settings.heroDesc,
      heroImage: updated.heroImage ?? settings.heroImage
    };
    setSettings(newSettings);
    setIsEditHeroOpen(false);

    try {
      await setDoc(doc(db, 'settings', 'main'), newSettings, { merge: true });
    } catch (err) {
      console.warn('Firestore settings hero sync notice:', err);
    }

    showToast('Banner principal atualizado com sucesso!');
  };

  const handleSaveLogo = async (newLogoUrl: string) => {
    const newSettings = {
      ...settings,
      logoImage: newLogoUrl
    };
    setSettings(newSettings);
    setIsEditLogoOpen(false);

    try {
      await setDoc(doc(db, 'settings', 'main'), newSettings, { merge: true });
    } catch (err) {
      console.warn('Firestore settings logo sync notice:', err);
    }

    showToast('Logo do estúdio atualizado com sucesso!');
  };

  const handleSaveThemeAndText = async (updatedSettings: Partial<StudioSettings>) => {
    const merged = {
      ...settings,
      ...updatedSettings
    };
    setSettings(merged);
    applyThemeToDocument(
      merged.themeBgColor || '#07152b',
      merged.themeTextColor || '#ffffff',
      merged.themePrimaryColor || 'blue'
    );

    try {
      await setDoc(doc(db, 'settings', 'main'), merged, { merge: true });
    } catch (err) {
      console.warn('Firestore settings theme sync notice:', err);
    }

    showToast('Cores do sistema e textos atualizados com sucesso!');
  };

  const handleSaveMessages = async (clientTemplate: string, staffTemplate: string) => {
    const merged = {
      ...settings,
      customClientMessageTemplate: clientTemplate,
      customStaffMessageTemplate: staffTemplate
    };
    setSettings(merged);

    try {
      await setDoc(doc(db, 'settings', 'main'), merged, { merge: true });
    } catch (err) {
      console.warn('Firestore settings messages sync notice:', err);
    }

    showToast('Modelos de mensagens do WhatsApp atualizados com sucesso!');
  };

  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);

  const handleSyncAllToFirestore = async () => {
    setIsSyncingFirebase(true);
    try {
      // 1. Settings
      const settingsToSync = {
        ...settings,
        pixKey: '21976333205',
        pixKeyType: 'Telefone Celular',
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'settings', 'main'), settingsToSync, { merge: true });

      // 2. Services
      for (const s of services) {
        await setDoc(doc(db, 'services', s.id), s);
      }

      // 3. Products
      for (const p of products) {
        await setDoc(doc(db, 'products', p.id), p);
      }

      // 4. Staff
      for (const m of staff) {
        await setDoc(doc(db, 'staff', m.id), m);
      }

      // 5. Bookings
      for (const b of bookings) {
        await setDoc(doc(db, 'bookings', b.id), b);
      }

      // 6. Admin user
      await setDoc(
        doc(db, 'admins', 'andrearmamentista'),
        {
          email: 'andrearmamentista@gmail.com',
          role: 'superadmin',
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      showToast('🔥 Todos os dados foram sincronizados com sucesso no Firebase!');
    } catch (err) {
      console.error('Erro na sincronização Firebase:', err);
      showToast('Aviso: dados gravados localmente, verificando conexão Firebase.');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  // Direct Image URL updates with caption and name support
  const handleOpenDirectImageModal = (
    title: string,
    currentUrl: string,
    defaultUrl: string,
    onSave: (url: string, caption?: string, name?: string) => void,
    currentCaption?: string,
    captionLabel?: string,
    currentName?: string,
    nameLabel?: string
  ) => {
    if (!isAdminAuthenticated) {
      setIsAdminAuthOpen(true);
      return;
    }
    setImageModalConfig({
      isOpen: true,
      title,
      currentUrl,
      defaultUrl,
      currentCaption: currentCaption || '',
      captionLabel: captionLabel || 'Legenda / Texto Descritivo:',
      currentName: currentName || '',
      nameLabel,
      onSave: (newUrl, newCaption, newName) => {
        onSave(newUrl, newCaption, newName);
        setImageModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('Imagem e dados atualizados com sucesso!');
      }
    });
  };

  const handleUpdateServiceImage = async (serviceId: string, newImageUrl: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, image: newImageUrl } : s))
    );

    try {
      await updateDoc(doc(db, 'services', serviceId), { image: newImageUrl });
    } catch (err) {
      console.warn('Firestore service image update notice:', err);
    }
  };

  const handleUpdateProductImage = async (productId: string, newImageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: newImageUrl } : p))
    );

    try {
      await updateDoc(doc(db, 'products', productId), { image: newImageUrl });
    } catch (err) {
      console.warn('Firestore product image update notice:', err);
    }
  };

  const handleUpdateHeroImage = async (newImageUrl: string) => {
    const updated = { ...settings, heroImage: newImageUrl };
    setSettings(updated);

    try {
      await setDoc(doc(db, 'settings', 'main'), { heroImage: newImageUrl }, { merge: true });
    } catch (err) {
      console.warn('Firestore hero image update notice:', err);
    }
  };

  const handleUpdateMasterImage = async (newImageUrl: string) => {
    const updatedStaff = staff.map((s, idx) =>
      idx === 0 ? { ...s, image: newImageUrl } : s
    );
    setStaff(updatedStaff);

    if (staff[0]) {
      try {
        await updateDoc(doc(db, 'staff', staff[0].id), { image: newImageUrl });
      } catch (err) {
        console.warn('Firestore master image update notice:', err);
      }
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    try {
      await updateDoc(doc(db, 'bookings', id), { status: newStatus });
    } catch (err) {
      console.warn('Firestore booking status update notice:', err);
    }

    showToast(`Status do agendamento alterado para "${newStatus}".`);
  };

  const handleDeleteBooking = async (id: string) => {
    // 1. Immediately store in persistent deleted IDs
    try {
      const raw = localStorage.getItem('mbronze_deleted_booking_ids');
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem('mbronze_deleted_booking_ids', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Deleted booking ID storage warning:', e);
    }

    // 2. Remove from active state and localStorage
    setBookings((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      localStorage.setItem('mbronze_bookings', JSON.stringify(filtered));
      return filtered;
    });

    // 3. Delete from Firestore if exists
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      console.warn('Firestore booking delete notice:', err);
    }

    showToast('Cliente e agendamento excluídos com sucesso!');
  };

  const handleScrollToServices = () => {
    const el = document.getElementById('procedimentos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToBoutique = () => {
    const el = document.getElementById('boutique');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white transition-colors duration-300"
      style={{
        backgroundColor: settings.themeBgColor || '#120207',
        color: settings.themeTextColor || '#f9fafb'
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gold-500 text-ruby-950 font-bold px-5 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm border border-gold-300 flex items-center space-x-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onSwitchTab={setCurrentTab}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPix={() => setIsPixModalOpen(true)}
        onOpenImageManager={() => {
          if (!isAdminAuthenticated) {
            setIsAdminAuthOpen(true);
          } else {
            setCurrentTab('admin');
          }
        }}
        onOpenAdminAuth={handleOpenAdminAuth}
        studioName={settings.studioName}
        subtitle={settings.subtitle}
        logoImage={settings.logoImage}
        isAdminLoggedIn={isAdminAuthenticated}
        onEditLogo={() => setIsEditLogoOpen(true)}
        currentUser={
          auth.currentUser
            ? {
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
              }
            : null
        }
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleLogout}
      />

      {/* Admin Quick Action Strip when Logged In */}
      {isAdminAuthenticated && (
        <AdminBar
          currentTab={currentTab}
          onSwitchTab={setCurrentTab}
          onOpenNewService={() => {
            setEditingService({
              id: `srv-${Date.now()}`,
              title: '',
              price: 120,
              duration: '45 min',
              desc: '',
              phototypeRecommended: 'Todos os fototipos',
              image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
            });
          }}
          onOpenNewProduct={() => {
            setEditingProduct({
              id: `prod-${Date.now()}`,
              name: '',
              price: 45,
              category: 'Bronze & Brilho',
              desc: '',
              image: 'https://images.unsplash.com/photo-1608248597261-8332580476a0?auto=format&fit=crop&w=600&q=80',
              inStock: true
            });
          }}
          onOpenEditHero={() => setIsEditHeroOpen(true)}
          onOpenEditLogo={() => setIsEditLogoOpen(true)}
          onOpenThemeAndTextCustomizer={() => setIsThemeCustomizerOpen(true)}
          onLogout={handleLogout}
          adminLoginName={adminCredentials.login}
        />
      )}

      {/* Animated VIP Marquee Ticker */}
      <AnimatedMarquee />

      {/* Main View Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full">
        {/* VIEW 1: CATALOG (HOME) */}
        {currentTab === 'catalog' && (
          <div className="space-y-14">
            {/* Hero Banner with High-Impact CTAs and In-App Editing */}
            <Hero
              heroImage={settings.heroImage}
              heroTitle={settings.heroTitle}
              heroDesc={settings.heroDesc}
              btnServicesText={settings.btnServicesText}
              btnBoutiqueText={settings.btnBoutiqueText}
              isAdminLoggedIn={isAdminAuthenticated}
              onEditHero={() => setIsEditHeroOpen(true)}
              onEditHeroImage={() =>
                handleOpenDirectImageModal(
                  'Banner Hero Principal',
                  settings.heroImage,
                  INITIAL_SETTINGS.heroImage,
                  handleUpdateHeroImage
                )
              }
              onScrollToServices={handleScrollToServices}
              onScrollToBoutique={handleScrollToBoutique}
            />

            {/* Mascot VIP Spotlight: Morena com marquinha de fita e biquíni azul */}
            <MascotSpotlight
              onStartBooking={() => handleStartBooking(services[0])}
              onExploreServices={handleScrollToServices}
            />

            {/* Services Grid with Direct In-App Editing support (Admin only) */}
            <ServicesSection
              services={services}
              servicesTitle={settings.servicesTitle}
              servicesSubtitle={settings.servicesSubtitle}
              onSelectService={handleStartBooking}
              onEditServiceImage={(srv) =>
                handleOpenDirectImageModal(
                  `Imagem do Procedimento: ${srv.title}`,
                  srv.image,
                  INITIAL_SERVICES.find((s) => s.id === srv.id)?.image || srv.image,
                  (url) => handleUpdateServiceImage(srv.id, url)
                )
              }
              isAdminLoggedIn={isAdminAuthenticated}
              onEditService={(srv) => setEditingService(srv)}
              onAddNewService={() => {
                setEditingService({
                  id: `srv-${Date.now()}`,
                  title: '',
                  price: 120,
                  duration: '45 min',
                  desc: '',
                  phototypeRecommended: 'Todos os fototipos',
                  image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
                });
              }}
            />

            {/* Tanning Preparation & Safety Protocol Guide */}
            <TanningGuide />

            {/* Dedicated Staff Specialists: allows editing photo, caption/role AND name directly */}
            <ProfessionalAndStudio
              settings={settings}
              staff={staff}
              isAdminLoggedIn={isAdminAuthenticated}
              onEditStaff={(member) => setEditingStaffMember(member)}
              onEditStaffPhoto={(member) =>
                handleOpenDirectImageModal(
                  `Foto, Legenda & Nome de ${member.name}`,
                  member.image,
                  member.image,
                  (newUrl, newCaption, newName) => {
                    const updated: StaffMember = {
                      ...member,
                      image: newUrl,
                      name: newName && newName.trim() ? newName.trim() : member.name,
                      role: newCaption && newCaption.trim() ? newCaption.trim() : member.role
                    };
                    handleSaveStaffMember(updated);
                  },
                  member.role,
                  'Legenda / Cargo da Especialista (Ex: Personal Bronze Master):',
                  member.name,
                  'Nome da Profissional:'
                )
              }
              onStartBookingWithStaff={handleStartBookingWithStaff}
            />

            {/* Boutique Sensual Products with Direct Comprar & In-App Editing */}
            <BoutiqueSection
              products={products}
              boutiqueTitle={settings.boutiqueTitle}
              boutiqueSubtitle={settings.boutiqueSubtitle}
              btnBuyText={settings.btnBuyText}
              whatsappNumber={settings.whatsapp}
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onEditProductImage={(prod) =>
                handleOpenDirectImageModal(
                  `Imagem do Produto: ${prod.name}`,
                  prod.image,
                  INITIAL_PRODUCTS.find((p) => p.id === prod.id)?.image || prod.image,
                  (url) => handleUpdateProductImage(prod.id, url)
                )
              }
              addedProductId={addedProductId}
              isAdminLoggedIn={isAdminAuthenticated}
              onEditProduct={(prod) => setEditingProduct(prod)}
              onAddNewProduct={() => {
                setEditingProduct({
                  id: `prod-${Date.now()}`,
                  name: '',
                  price: 45,
                  category: 'Bronze & Brilho',
                  desc: '',
                  image: 'https://images.unsplash.com/photo-1608248597261-8332580476a0?auto=format&fit=crop&w=600&q=80',
                  inStock: true
                });
              }}
            />

            {/* Nosso Studio VIP - Moved to the end of the page as requested */}
            <StudioLocationSection
              settings={settings}
              isAdminLoggedIn={isAdminAuthenticated}
              onEditSettings={() => setIsThemeCustomizerOpen(true)}
            />
          </div>
        )}

        {/* VIEW 2: BOOKING WIZARD */}
        {currentTab === 'booking' && selectedServiceForBooking && (
          <BookingWizard
            selectedService={selectedServiceForBooking}
            settings={settings}
            staff={staff}
            initialSelectedStaffId={preselectedStaffId}
            existingBookings={bookings}
            isAdminLoggedIn={isAdminAuthenticated}
            onOpenEditMessages={() => setIsEditMessagesOpen(true)}
            onCancel={handleCancelBooking}
            onBookingConfirmed={handleBookingConfirmed}
          />
        )}

        {/* VIEW 3: ADMIN DASHBOARD */}
        {currentTab === 'admin' && (
          <AdminDashboard
            bookings={bookings}
            services={services}
            products={products}
            settings={settings}
            staff={staff}
            onUpdateStaff={(newStaff) => {
              setStaff(newStaff);
              newStaff.forEach((s) => {
                setDoc(doc(db, 'staff', s.id), s).catch(console.warn);
              });
            }}
            onOpenThemeAndTextCustomizer={() => setIsThemeCustomizerOpen(true)}
            onOpenEditMessages={() => setIsEditMessagesOpen(true)}
            onSyncAllToFirestore={handleSyncAllToFirestore}
            isSyncingFirebase={isSyncingFirebase}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onUpdateServiceImage={handleUpdateServiceImage}
            onUpdateProductImage={handleUpdateProductImage}
            onUpdateHeroImage={handleUpdateHeroImage}
            onUpdateMasterImage={handleUpdateMasterImage}
            onUpdateSettings={handleSaveThemeAndText}
            onUpdateService={handleSaveService}
            onAddService={handleSaveService}
            onUpdateProduct={handleSaveProduct}
            onAddProduct={handleSaveProduct}
            onExitAdmin={() => setCurrentTab('catalog')}
            credentials={adminCredentials}
            onUpdateCredentials={(newCreds) => {
              setAdminCredentials(newCreds);
              showToast('Credenciais da administradora atualizadas com segurança!');
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        settings={settings}
      />

      {/* Quick Pix QR Code Modal (Instant Phone Camera Scan) */}
      <QuickPixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        settings={settings}
        defaultAmount={25}
      />

      {/* Admin Authentication Modal (Login + Password & Google Auth) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        credentials={adminCredentials}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* In-App Direct Procedure Editor Modal (Admin only) */}
      <EditServiceModal
        isOpen={Boolean(editingService)}
        onClose={() => setEditingService(null)}
        service={editingService}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />

      {/* In-App Direct Product Editor Modal (Admin only) */}
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />

      {/* In-App Direct Hero Banner Editor Modal (Admin only) */}
      <EditHeroModal
        isOpen={isEditHeroOpen}
        onClose={() => setIsEditHeroOpen(false)}
        settings={settings}
        onSave={handleSaveHero}
      />

      {/* In-App Direct Logo Editor Modal (Admin only) */}
      <EditLogoModal
        isOpen={isEditLogoOpen}
        onClose={() => setIsEditLogoOpen(false)}
        currentLogoUrl={settings.logoImage}
        studioName={settings.studioName}
        onSaveLogo={handleSaveLogo}
      />

      {/* In-App Theme Colors & Line-by-Line Text Editor Modal (Admin only) */}
      <ThemeAndTextCustomizerModal
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
        settings={settings}
        onSave={handleSaveThemeAndText}
      />

      {/* In-App WhatsApp Confirmation & Staff Alert Messages Editor Modal (Admin only) */}
      <EditMessagesModal
        isOpen={isEditMessagesOpen}
        onClose={() => setIsEditMessagesOpen(false)}
        settings={settings}
        onSaveMessages={handleSaveMessages}
      />

      {/* In-App Direct Professional/Staff Editor Modal (Admin only) */}
      <EditStaffModal
        isOpen={Boolean(editingStaffMember)}
        onClose={() => setEditingStaffMember(null)}
        staffMember={editingStaffMember}
        onSave={handleSaveStaffMember}
      />

      {/* Direct Image Links, Caption & Name Uploader Modal */}
      <DirectImageModal
        isOpen={imageModalConfig.isOpen}
        onClose={() => setImageModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={imageModalConfig.title}
        currentUrl={imageModalConfig.currentUrl}
        defaultUrl={imageModalConfig.defaultUrl}
        currentCaption={imageModalConfig.currentCaption}
        captionLabel={imageModalConfig.captionLabel}
        currentName={imageModalConfig.currentName}
        nameLabel={imageModalConfig.nameLabel}
        onSave={imageModalConfig.onSave}
      />

      {/* Floating Concierge for Immediate WhatsApp Queries (Left) */}
      <FloatingWhatsAppConcierge settings={settings} />

      {/* Animated Morena Mascot Companion with Tape Tan Line Tips (Right) */}
      <MascotWidget
        onStartBooking={() => handleStartBooking(services[0])}
        onExploreBoutique={handleScrollToBoutique}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenImageManager={() => {
          if (!isAdminAuthenticated) {
            setIsAdminAuthOpen(true);
          } else {
            setCurrentTab('admin');
          }
        }}
        onOpenAdminAuth={handleOpenAdminAuth}
      />
    </div>
  );
}
