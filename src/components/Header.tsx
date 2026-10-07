import React from 'react';
import { Sun, ShoppingBag, Lock, Image as ImageIcon, Edit2, LogOut, User } from 'lucide-react';
import { ViewTab } from '../types';
import mascotImage from '../assets/images/mascote.jpg';

interface HeaderProps {
  currentTab: ViewTab;
  onSwitchTab: (tab: ViewTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenImageManager: () => void;
  onOpenAdminAuth: () => void;
  studioName: string;
  subtitle: string;
  logoImage?: string;
  isAdminLoggedIn?: boolean;
  onEditLogo?: () => void;
  currentUser?: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  onGoogleSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSwitchTab,
  cartCount,
  onOpenCart,
  onOpenImageManager,
  onOpenAdminAuth,
  studioName,
  subtitle,
  logoImage,
  isAdminLoggedIn,
  onEditLogo,
  currentUser,
  onGoogleSignIn,
  onSignOut
}) => {
  const displayLogo = logoImage || mascotImage;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-ruby-800/60 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Zone with Mascot Logo & Editable Logo for Admin */}
        <div className="flex items-center space-x-3 select-none">
          <div className="relative group">
            <div
              onClick={() => onSwitchTab('catalog')}
              className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-lg shadow-ruby-950/80 border-2 border-gold-400 bg-gradient-to-tr from-sky-600 via-blue-700 to-gold-400 p-0.5 hover:scale-105 transition-transform"
              title="Mascote Moreninha do Bronze - Início"
            >
              <img
                src={displayLogo}
                alt={studioName}
                className="w-full h-full object-cover rounded-full object-top"
              />
            </div>

            {/* Quick edit logo button for authenticated admin */}
            {isAdminLoggedIn && onEditLogo && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditLogo();
                }}
                title="Trocar foto do logo (Admin)"
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-gold-500 text-ruby-950 font-bold hover:bg-gold-400 transition shadow cursor-pointer"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          <div
            onClick={() => onSwitchTab('catalog')}
            className="cursor-pointer"
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                {studioName}
              </span>
            </div>
            <p className="text-[10px] text-gold-400 font-medium tracking-wide uppercase">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-gray-300">
          <button
            onClick={() => {
              onSwitchTab('catalog');
              const el = document.getElementById('procedimentos');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-gold-300 transition-colors cursor-pointer"
          >
            Procedimentos VIP
          </button>
          <button
            onClick={() => {
              onSwitchTab('catalog');
              const el = document.getElementById('profissionais');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-gold-300 transition-colors cursor-pointer"
          >
            Nossa Equipe
          </button>
          <button
            onClick={() => {
              onSwitchTab('catalog');
              const el = document.getElementById('boutique');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-gold-300 transition-colors cursor-pointer"
          >
            Boutique Sensual
          </button>
          <button
            onClick={() => {
              onSwitchTab('catalog');
              const el = document.getElementById('studio-vip');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-gold-300 transition-colors cursor-pointer"
          >
            Studio VIP
          </button>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center space-x-2">
          {/* Google Auth Status / Button */}
          {currentUser ? (
            <div className="flex items-center space-x-1.5 bg-ruby-950/80 border border-ruby-800 rounded-xl px-2.5 py-1">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Usuário'}
                  className="w-5 h-5 rounded-full object-cover border border-gold-400/60"
                />
              ) : (
                <User className="w-4 h-4 text-gold-400" />
              )}
              <span className="hidden sm:inline text-[11px] text-gray-200 font-medium max-w-[90px] truncate">
                {currentUser.displayName?.split(' ')[0] || 'Admin'}
              </span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sair da conta Google"
                  className="p-1 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-ruby-400" />
                </button>
              )}
            </div>
          ) : (
            onGoogleSignIn && (
              <button
                onClick={onGoogleSignIn}
                title="Fazer login com Google para sincronizar seus agendamentos"
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-gold-400/40 bg-ruby-950/60 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-xs font-semibold transition cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar</span>
              </button>
            )
          )}

          {/* Direct Images Guide/Manager Button - ONLY for logged-in admin */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenImageManager}
              title="Gerenciar Links Diretos de Imagens"
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-ruby-700/80 bg-ruby-950/60 hover:bg-ruby-900/60 text-xs font-medium text-ruby-200 hover:text-gold-300 transition cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
              <span>Fotos</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir Sacola de Compras"
            className="relative p-2 rounded-xl text-ruby-200 hover:text-gold-400 hover:bg-ruby-900/50 transition border border-transparent hover:border-ruby-700/50 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ruby-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Toggle */}
          <button
            onClick={onOpenAdminAuth}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer ${
              currentTab === 'admin'
                ? 'bg-gold-500 text-ruby-950 border-gold-400 font-bold'
                : isAdminLoggedIn
                ? 'bg-ruby-900/80 border-gold-400/60 text-gold-300 font-medium'
                : 'border-gold-400/40 text-gold-300 hover:bg-gold-400/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Painel Admin' : 'Área Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
