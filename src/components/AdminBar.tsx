import React from 'react';
import { Crown, Sliders, Plus, LogOut, Edit3, Eye, Sun, Palette, Image as ImageIcon, Database } from 'lucide-react';
import { ViewTab } from '../types';

interface AdminBarProps {
  currentTab: ViewTab;
  onSwitchTab: (tab: ViewTab) => void;
  onOpenNewService: () => void;
  onOpenNewProduct: () => void;
  onOpenEditHero: () => void;
  onOpenEditLogo: () => void;
  onOpenThemeAndTextCustomizer: () => void;
  onLogout: () => void;
  adminLoginName: string;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  currentTab,
  onSwitchTab,
  onOpenNewService,
  onOpenNewProduct,
  onOpenEditHero,
  onOpenEditLogo,
  onOpenThemeAndTextCustomizer,
  onLogout,
  adminLoginName
}) => {
  return (
    <div className="bg-gradient-to-r from-ruby-950 via-ruby-900 to-ruby-950 border-b border-gold-400/40 px-4 py-2 sticky top-[57px] z-30 shadow-xl backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-400" />
          </span>

          <span className="font-bold text-gold-300 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Modo Administradora:</span>
          </span>
          <span className="text-gray-300 font-medium">@{adminLoginName}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/60 text-[10px] text-emerald-300 font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Firebase Online</span>
          </span>
        </div>

        {/* Right: Quick In-App Action Buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Theme & Text Line-by-Line Customizer */}
          <button
            onClick={onOpenThemeAndTextCustomizer}
            className="px-2.5 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-ruby-950 text-[11px] font-bold shadow-md transition flex items-center space-x-1 cursor-pointer"
            title="Trocar cores do sistema e letras, e editar textos linha por linha"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🎨 Cores & Textos</span>
          </button>

          {currentTab === 'catalog' ? (
            <>
              <button
                onClick={onOpenEditLogo}
                className="px-2.5 py-1 rounded-lg bg-ruby-950/80 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-[11px] font-medium border border-gold-400/30 transition flex items-center space-x-1 cursor-pointer"
                title="Alterar logo da loja enviando foto do celular"
              >
                <Sun className="w-3 h-3" />
                <span>Logo</span>
              </button>

              <button
                onClick={onOpenEditHero}
                className="px-2.5 py-1 rounded-lg bg-ruby-950/80 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-[11px] font-medium border border-gold-400/30 transition flex items-center space-x-1 cursor-pointer"
                title="Editar título e texto do banner"
              >
                <Edit3 className="w-3 h-3" />
                <span>Banner</span>
              </button>

              <button
                onClick={onOpenNewService}
                className="px-2.5 py-1 rounded-lg bg-ruby-950/80 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-[11px] font-medium border border-gold-400/30 transition flex items-center space-x-1 cursor-pointer"
                title="Cadastrar novo procedimento"
              >
                <Plus className="w-3 h-3" />
                <span>+ Serviço</span>
              </button>

              <button
                onClick={onOpenNewProduct}
                className="px-2.5 py-1 rounded-lg bg-ruby-950/80 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-[11px] font-medium border border-gold-400/30 transition flex items-center space-x-1 cursor-pointer"
                title="Cadastrar novo produto na boutique"
              >
                <Plus className="w-3 h-3" />
                <span>+ Produto</span>
              </button>

              <button
                onClick={() => onSwitchTab('admin')}
                className="px-3 py-1 rounded-lg bg-ruby-900 hover:bg-ruby-800 text-gold-300 border border-ruby-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
              >
                <Sliders className="w-3 h-3" />
                <span>Painel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onSwitchTab('catalog')}
              className="px-3 py-1 rounded-lg bg-ruby-900 hover:bg-ruby-800 text-gold-300 border border-ruby-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
            >
              <Eye className="w-3 h-3" />
              <span>Ver Vitrine do App</span>
            </button>
          )}

          <button
            onClick={onLogout}
            title="Encerrar sessão de administradora"
            className="px-2.5 py-1 rounded-lg bg-ruby-950 hover:bg-ruby-900 border border-ruby-700 text-gray-300 hover:text-white text-[11px] transition flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-ruby-400" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
