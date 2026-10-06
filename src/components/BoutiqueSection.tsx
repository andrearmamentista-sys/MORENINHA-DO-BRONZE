import React, { useState, useMemo } from 'react';
import {
  Gem,
  ShoppingCart,
  Shield,
  Edit2,
  Check,
  Search,
  X,
  PackageOpen,
  Plus,
  Settings,
  Sparkles,
  Heart,
  MessageCircle,
  Truck,
  Eye,
  Flame,
  Star
} from 'lucide-react';
import { BoutiqueProduct } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface BoutiqueSectionProps {
  products: BoutiqueProduct[];
  onAddToCart: (product: BoutiqueProduct) => void;
  onOpenCart?: () => void;
  onEditProductImage: (product: BoutiqueProduct) => void;
  addedProductId: string | null;
  isAdminLoggedIn?: boolean;
  onEditProduct?: (product: BoutiqueProduct) => void;
  onAddNewProduct?: () => void;
  boutiqueTitle?: string;
  boutiqueSubtitle?: string;
  btnBuyText?: string;
  whatsappNumber?: string;
}

export const BoutiqueSection: React.FC<BoutiqueSectionProps> = ({
  products,
  onAddToCart,
  onOpenCart,
  onEditProductImage,
  addedProductId,
  isAdminLoggedIn,
  onEditProduct,
  onAddNewProduct,
  boutiqueTitle,
  boutiqueSubtitle,
  btnBuyText,
  whatsappNumber = '5521998765432'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Extract unique categories dynamically from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['todos', ...cats];
  }, [products]);

  // Filter products based on search query and selected category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        (product.desc && product.desc.toLowerCase().includes(term)) ||
        (product.category && product.category.toLowerCase().includes(term));

      const matchesCategory =
        selectedCategory === 'todos' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
  };

  const handleDirectWhatsAppOrder = (product: BoutiqueProduct) => {
    const cleanDigits = whatsappNumber.replace(/\D/g, '');
    const phoneWithDDI = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
    const msg = `✨ Olá! Estava na Boutique Sensual do estúdio e me encantei com o produto: *${product.name}* (R$ ${product.price.toFixed(2).replace('.', ',')}). Gostaria de verificar a disponibilidade e garantir o meu! 💖`;
    const url = `https://wa.me/${phoneWithDDI}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <section
      id="boutique"
      className="relative rounded-3xl p-6 sm:p-10 border-2 border-pink-500/40 bg-gradient-to-br from-indigo-950/85 via-purple-950/90 to-slate-950 shadow-[0_0_50px_rgba(217,70,239,0.2)] scroll-mt-20 overflow-hidden space-y-8"
    >
      {/* Sensual Ambient Lighting Orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Glamour VIP Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-pink-500/30 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-fuchsia-500/20 border border-pink-400/40 text-pink-300 text-xs font-bold shadow-lg">
            <Gem className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="tracking-wider uppercase">Coleção Exclusiva & Sigilosa</span>
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-pink-300 drop-shadow flex items-center gap-3">
            <span>{boutiqueTitle || 'Boutique Sensual & Acessórios VIP'}</span>
          </h3>

          <p className="text-xs sm:text-sm text-pink-200/90 max-w-2xl leading-relaxed font-light">
            {boutiqueSubtitle ||
              'Produtos exclusivos para realçar sua marquinha dourada, hidratar sua pele e despertar momentos inesquecíveis. Retirada discreta no estúdio ou envio com total sigilo.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-pink-900/60 transition cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ver Sacola VIP</span>
            </button>
          )}

          {isAdminLoggedIn && onAddNewProduct && (
            <button
              onClick={onAddNewProduct}
              className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-ruby-950 font-bold text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
              title="Cadastrar novo produto na boutique"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
          )}
        </div>
      </div>

      {/* Sensual Confidence Trust Badges Bar */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/20 backdrop-blur-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-400/30">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-white block">100% Discreto</span>
            <span className="text-pink-300/80">Embalagem sem nomes</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20 backdrop-blur-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-400/30">
            <Heart className="w-4 h-4 fill-purple-400" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-white block">Afrodisíacos & Cheirosos</span>
            <span className="text-purple-300/80">Com feromônios e aroma</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-sky-500/20 backdrop-blur-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
            <Sparkles className="w-4 h-4 text-sky-300" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-white block">Ouro 24k & Hidratação</span>
            <span className="text-sky-300/80">Prolonga o bronze dourado</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 backdrop-blur-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-white block">Pronta Entrega</span>
            <span className="text-amber-200/80">Pegue no estúdio ou envio</span>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="relative z-10 glass-card rounded-2xl p-4 border border-pink-500/30 bg-slate-950/70 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Functional Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar perfume de calcinha, óleo iluminador, gel beijável, fitas..."
              className="w-full bg-black/70 border border-pink-500/40 focus:border-pink-400 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-pink-300/50 focus:outline-none transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                title="Limpar pesquisa"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Counter */}
          <div className="text-xs text-pink-200/80 self-center shrink-0 font-medium">
            <span>
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 border border-pink-300'
                    : 'bg-black/50 text-pink-200/80 border border-pink-500/30 hover:border-pink-400 hover:text-white'
                }`}
              >
                {cat === 'todos' ? '✨ Todos os Produtos' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large, Prominent Products Showcase Grid */}
      {filteredProducts.length === 0 ? (
        <div className="relative z-10 glass-card rounded-3xl p-8 border border-pink-500/30 text-center space-y-3 py-16 bg-black/40">
          <div className="w-14 h-14 rounded-full bg-pink-900/40 border border-pink-500/50 text-pink-300 flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-white">Nenhum produto encontrado</h4>
            <p className="text-xs text-pink-200/80 mt-1 max-w-sm mx-auto">
              Não encontramos nenhum item correspondente a "{searchQuery}". Tente usar outro termo ou veja todos os itens.
            </p>
          </div>
          <button
            onClick={handleClearSearch}
            className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg"
          >
            Limpar Busca e Ver Catálogo Completo
          </button>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isJustAdded = addedProductId === product.id;
            const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
            const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl overflow-hidden border border-pink-500/40 bg-gradient-to-b from-slate-950/95 via-purple-950/70 to-slate-950/95 hover:border-pink-400 transition-all duration-300 flex flex-col justify-between shadow-2xl hover:shadow-[0_0_35px_rgba(236,72,153,0.35)]"
              >
                <div>
                  {/* High-Resolution Large Image Showcase */}
                  <div className="h-60 sm:h-72 w-full overflow-hidden relative bg-black/80">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      fallbackTitle={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onEditImage={() => onEditProductImage(product)}
                    />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      {product.badge ? (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-extrabold text-[11px] shadow-lg border border-pink-300/40 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-gold-300 text-gold-300" />
                          <span>{product.badge}</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] shadow-lg border border-purple-300/40">
                          {product.category}
                        </span>
                      )}

                      {discountPct > 0 && (
                        <span className="self-start px-2 py-0.5 rounded-md bg-amber-500 text-ruby-950 font-black text-[10px] shadow">
                          -{discountPct}% OFF
                        </span>
                      )}
                    </div>

                    {/* Category pill on bottom-left */}
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-semibold text-pink-300 border border-pink-400/30">
                        {product.category}
                      </span>
                    </div>

                    {/* Admin Edit Button */}
                    {isAdminLoggedIn && onEditProduct ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product);
                        }}
                        title="Editar produto"
                        className="absolute top-3 right-3 p-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-ruby-950 font-bold shadow-lg transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProductImage(product);
                        }}
                        title="Trocar imagem"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-black/80 hover:bg-pink-900 text-pink-300 border border-pink-400/30 shadow backdrop-blur-sm cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                      {product.name}
                    </h4>

                    {product.desc && (
                      <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                        {product.desc}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Em estoque · Retirada rápida no estúdio</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Two Action Buttons */}
                <div className="p-5 sm:p-6 pt-3 border-t border-purple-900/60 bg-black/40 space-y-3.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-pink-300/80 uppercase font-semibold block">
                        Preço Especial Boutique
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 tabular-nums">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        {originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            R$ {originalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-pink-400 font-semibold bg-pink-500/15 px-2.5 py-1 rounded-full border border-pink-500/30">
                      Sigilo Garantido
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Add to Cart */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-pink-900/40 hover:scale-[1.02]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Adicionado!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>{btnBuyText || 'Adicionar'}</span>
                        </>
                      )}
                    </button>

                    {/* Direct WhatsApp Instant Buy */}
                    <button
                      onClick={() => handleDirectWhatsAppOrder(product)}
                      className="py-3 px-3 rounded-xl bg-black/60 hover:bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition cursor-pointer hover:border-emerald-400"
                      title="Pedir direto pelo WhatsApp com atendente"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Pedir no Zap</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
