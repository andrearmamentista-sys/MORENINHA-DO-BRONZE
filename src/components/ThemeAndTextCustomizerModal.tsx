import React, { useState } from 'react';
import { X, Check, Palette, Type, Sparkles, RotateCcw, Sliders, Eye } from 'lucide-react';
import { StudioSettings } from '../types';
import { applyThemeToDocument } from '../utils/themeEngine';

interface ThemeAndTextCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onSave: (updatedSettings: Partial<StudioSettings>) => void;
}

export const ThemeAndTextCustomizerModal: React.FC<ThemeAndTextCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'colors' | 'texts'>('colors');

  // Form State
  const [formData, setFormData] = useState<Partial<StudioSettings>>({
    studioName: settings.studioName,
    subtitle: settings.subtitle,
    heroTitle: settings.heroTitle || 'Sua marquinha perfeita com o luxo e o cuidado que você merece.',
    heroDesc: settings.heroDesc || 'Procedimentos personalizados com fita milimétrica, aceleradores importados e acompanhamento rigoroso por fototipo de pele.',
    servicesTitle: settings.servicesTitle || 'Técnicas de Bronzeamento Personalizado',
    servicesSubtitle: settings.servicesSubtitle || 'Menu de Procedimentos',
    boutiqueTitle: settings.boutiqueTitle || 'Boutique Sensual & Acessórios',
    boutiqueSubtitle: settings.boutiqueSubtitle || 'Produtos Exclusivos para seu Autocuidado',
    studioTitle: settings.studioTitle || 'Nossas Profissionais do Bronze',
    studioSubtitle: settings.studioSubtitle || 'Equipe Especializada & Espaço VIP',
    guideTitle: settings.guideTitle || 'Protocolo de Preparação e Cuidados com o Bronze',
    btnServicesText: settings.btnServicesText || 'Conhecer Procedimentos',
    btnBoutiqueText: settings.btnBoutiqueText || 'Boutique Sensual',
    btnBuyText: settings.btnBuyText || 'Comprar',
    address: settings.address,
    hours: settings.hours,
    whatsapp: settings.whatsapp,
    themePrimaryColor: settings.themePrimaryColor || 'blue',
    themeTextColor: settings.themeTextColor || '#ffffff',
    themeBgColor: settings.themeBgColor || '#07152b'
  });

  // Dynamic live color update helper: immediately applies changes to document styles
  const handleColorUpdate = (
    field: 'themeBgColor' | 'themeTextColor' | 'themePrimaryColor',
    value: string
  ) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    applyThemeToDocument(
      field === 'themeBgColor' ? value : formData.themeBgColor,
      field === 'themeTextColor' ? value : formData.themeTextColor,
      field === 'themePrimaryColor' ? value : formData.themePrimaryColor
    );
  };

  const handleCancelAndClose = () => {
    // Revert to saved settings on cancel
    applyThemeToDocument(
      settings.themeBgColor,
      settings.themeTextColor,
      settings.themePrimaryColor
    );
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyThemeToDocument(
      formData.themeBgColor,
      formData.themeTextColor,
      formData.themePrimaryColor
    );
    onSave(formData);
    onClose();
  };

  const bgOptions = [
    { label: 'Azul Safira Real (Recomendado)', value: '#07152b', color: 'bg-[#07152b]' },
    { label: 'Azul Oceano Noturno', value: '#030a17', color: 'bg-[#030a17]' },
    { label: 'Azul Céu Meia-Noite', value: '#0a1d3d', color: 'bg-[#0a1d3d]' },
    { label: 'Preto Ônix Luxo', value: '#040404', color: 'bg-[#040404]' },
    { label: 'Rubi Noturno Original', value: '#0d0407', color: 'bg-[#0d0407]' },
    { label: 'Esmeralda Nobre', value: '#020d09', color: 'bg-[#020d09]' },
    { label: 'Púrpura Ametista', value: '#0a0312', color: 'bg-[#0a0312]' },
    { label: 'Chocolate Dourado', value: '#140804', color: 'bg-[#140804]' }
  ];

  const textOptions = [
    { label: 'Branco Puro', value: '#ffffff' },
    { label: 'Dourado Suave', value: '#fef08a' },
    { label: 'Champagne Luxo', value: '#fef3c7' },
    { label: 'Azul Cristal', value: '#e0f2fe' },
    { label: 'Rosa Glamour', value: '#fce7f3' },
    { label: 'Gelo Prateado', value: '#f1f5f9' }
  ];

  const themePrimaryOptions = [
    { id: 'blue', name: 'Azul Royal VIP', color: 'bg-sky-500' },
    { id: 'gold', name: 'Ouro Imperial', color: 'bg-amber-500' },
    { id: 'ruby', name: 'Rubi Clássico', color: 'bg-rose-600' },
    { id: 'emerald', name: 'Esmeralda', color: 'bg-emerald-600' },
    { id: 'purple', name: 'Púrpura Noite', color: 'bg-purple-600' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-sky-500/40 space-y-4 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleCancelAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-sky-800/80 pb-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center font-bold text-xs">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editor de Cores & Textos do Sistema</h3>
            <p className="text-xs text-gray-400">
              Personalize a paleta visual em tempo real e altere qualquer texto do aplicativo.
            </p>
          </div>
        </div>

        {/* Live Preview Indicator */}
        <div className="bg-sky-950/70 border border-sky-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Pré-visualização Instantânea Ativa:</span>
          </div>
          <span className="text-[11px] font-mono text-sky-300">
            Fundo: {formData.themeBgColor} · Botões: {formData.themePrimaryColor}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-sky-900/60 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-sky-900/80 text-sky-200 border border-sky-500 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Cores do Sistema e Letras</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-sky-900/80 text-sky-200 border border-sky-500 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Editar Textos Linha por Linha</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* TAB 1: CORES */}
          {activeTab === 'colors' && (
            <div className="space-y-5">
              {/* Primary Color Palette */}
              <div className="space-y-2">
                <label className="text-gray-200 font-semibold block">
                  1. Cor de Destaque dos Botões e Detalhes:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {themePrimaryOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleColorUpdate('themePrimaryColor', opt.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                        formData.themePrimaryColor === opt.id
                          ? 'border-sky-400 bg-sky-900/80 shadow-lg scale-102 ring-2 ring-sky-400/40'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${opt.color} shadow-md`} />
                      <span className="text-[11px] font-medium text-gray-200">{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-200 font-semibold block">
                    2. Cor de Fundo do Sistema (Com aplicação total em tempo real):
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-gray-400">Personalizado:</span>
                    <input
                      type="color"
                      value={formData.themeBgColor || '#07152b'}
                      onChange={(e) => handleColorUpdate('themeBgColor', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-600 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.themeBgColor || '#07152b'}
                      onChange={(e) => handleColorUpdate('themeBgColor', e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bgOptions.map((bg) => (
                    <button
                      key={bg.value}
                      type="button"
                      onClick={() => handleColorUpdate('themeBgColor', bg.value)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-3 transition cursor-pointer ${
                        formData.themeBgColor === bg.value
                          ? 'border-sky-400 bg-sky-900/80 shadow-md ring-2 ring-sky-400/40'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg ${bg.color} border border-gray-600 shrink-0 shadow-inner`} />
                      <span className="text-xs text-gray-200">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-200 font-semibold block">
                    3. Cor das Letras / Títulos Principais:
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-gray-400">Personalizado:</span>
                    <input
                      type="color"
                      value={formData.themeTextColor || '#ffffff'}
                      onChange={(e) => handleColorUpdate('themeTextColor', e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-600 bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.themeTextColor || '#ffffff'}
                      onChange={(e) => handleColorUpdate('themeTextColor', e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {textOptions.map((txt) => (
                    <button
                      key={txt.value}
                      type="button"
                      onClick={() => handleColorUpdate('themeTextColor', txt.value)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition cursor-pointer ${
                        formData.themeTextColor === txt.value
                          ? 'border-sky-400 bg-sky-900/80 shadow ring-2 ring-sky-400/40'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-500 shadow-inner shrink-0"
                        style={{ backgroundColor: txt.value }}
                      />
                      <span className="text-xs text-gray-200">{txt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEXTOS LINHA POR LINHA */}
          {activeTab === 'texts' && (
            <div className="space-y-4">
              {/* Studio & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Nome do Studio:</label>
                  <input
                    type="text"
                    value={formData.studioName || ''}
                    onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Subtítulo da Marca:</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Hero Banner Text */}
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Título Principal do Banner Hero:</label>
                <input
                  type="text"
                  value={formData.heroTitle || ''}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Descrição do Banner Hero:</label>
                <textarea
                  rows={2}
                  value={formData.heroDesc || ''}
                  onChange={(e) => setFormData({ ...formData, heroDesc: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Button Texts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Botão de Procedimentos:</label>
                  <input
                    type="text"
                    value={formData.btnServicesText || ''}
                    onChange={(e) => setFormData({ ...formData, btnServicesText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Botão da Boutique:</label>
                  <input
                    type="text"
                    value={formData.btnBoutiqueText || ''}
                    onChange={(e) => setFormData({ ...formData, btnBoutiqueText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Botão de Compra:</label>
                  <input
                    type="text"
                    value={formData.btnBuyText || ''}
                    onChange={(e) => setFormData({ ...formData, btnBuyText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Sections Headers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Título da Seção Serviços:</label>
                  <input
                    type="text"
                    value={formData.servicesTitle || ''}
                    onChange={(e) => setFormData({ ...formData, servicesTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">Título da Boutique Sensual:</label>
                  <input
                    type="text"
                    value={formData.boutiqueTitle || ''}
                    onChange={(e) => setFormData({ ...formData, boutiqueTitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-sky-900/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const defaultBlue = '#07152b';
                setFormData((prev) => ({
                  ...prev,
                  themeBgColor: defaultBlue,
                  themePrimaryColor: 'blue',
                  themeTextColor: '#ffffff'
                }));
                applyThemeToDocument(defaultBlue, '#ffffff', 'blue');
              }}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Azul Safira VIP</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCancelAndClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:text-white hover:bg-slate-900 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white font-semibold shadow-lg transition cursor-pointer flex items-center space-x-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Todas as Configurações</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
