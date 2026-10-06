import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  MessageCircle,
  QrCode
} from 'lucide-react';
import { CartItem, StudioSettings } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { DynamicPixCard } from './DynamicPixCard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  settings: StudioSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  settings
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pix'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTxId, setOrderTxId] = useState('');

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  const handleStartPixCheckout = () => {
    const tx = `PED${Date.now().toString().slice(-6)}`;
    setOrderTxId(tx);
    setCheckoutStep('pix');
  };

  const handleFinalizeWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const itemsSummary = cart
      .map(
        (item) =>
          `• ${item.qty}x ${item.product.name} — R$ ${(item.product.price * item.qty)
            .toFixed(2)
            .replace('.', ',')}`
      )
      .join('\n');

    const isPixCheckout = checkoutStep === 'pix';
    const msg =
      `*NOVO PEDIDO BOUTIQUE - MORENINHA DO BRONZE*\n\n` +
      `Olá, ${settings.masterName}! Confirmo meu pedido realizado na Boutique pelo app:\n\n` +
      `🏷️ *Código do Pedido:* #${orderTxId || 'PEDIDO-VIP'}\n` +
      (customerName ? `👤 *Cliente:* ${customerName}\n` : '') +
      (customerPhone ? `📱 *Contato:* ${customerPhone}\n` : '') +
      `\n🛍️ *Itens:*\n${itemsSummary}\n\n` +
      `💰 *Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}\n` +
      `💳 *Forma de Pagamento:* ${isPixCheckout ? 'Pix Antecipado' : 'Pagamento no Local / Na Retirada'}\n\n` +
      (isPixCheckout
        ? `Segue meu comprovante de pagamento Pix!`
        : `Combinarei o horário de retirada no estúdio para realizar o pagamento no local.`);

    setOrderPlaced(true);
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleCloseAndReset = () => {
    setCheckoutStep('cart');
    setOrderPlaced(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={handleCloseAndReset}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-ruby-950/95 border-l border-ruby-800/80 text-white p-5 sm:p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md overflow-y-auto">
          {/* Top Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ruby-900 pb-3">
              <div className="flex items-center space-x-2.5">
                {checkoutStep === 'pix' ? (
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-ruby-900/50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                    {checkoutStep === 'pix' ? 'Pagamento via Pix Dinâmico' : 'Sua Sacola Boutique'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {checkoutStep === 'pix'
                      ? `Total a pagar: R$ ${totalPrice.toFixed(2).replace('.', ',')}`
                      : `${totalItems} ${totalItems === 1 ? 'item selecionado' : 'itens selecionados'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseAndReset}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-ruby-900/50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VIEW 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-ruby-700 mx-auto stroke-[1.5]" />
                    <p className="text-xs text-gray-400">Sua sacola está vazia no momento.</p>
                    <button
                      onClick={handleCloseAndReset}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-gold-400 border border-gold-400/30 hover:bg-gold-400/10 transition"
                    >
                      Ver Produtos da Boutique
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-ruby-900/40 p-3 rounded-2xl border border-ruby-800/70 text-xs gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-ruby-700/60">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h6 className="font-semibold text-white truncate">{product.name}</h6>
                          <span className="text-gold-400 font-bold block mt-0.5">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center border border-ruby-700 rounded-lg overflow-hidden bg-ruby-950">
                          <button
                            onClick={() => onUpdateQty(product.id, -1)}
                            className="p-1 hover:bg-ruby-800 text-gray-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-white">{qty}</span>
                          <button
                            onClick={() => onUpdateQty(product.id, 1)}
                            className="p-1 hover:bg-ruby-800 text-gray-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-gray-400 hover:text-ruby-400 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* VIEW 2: DYNAMIC PIX CHECKOUT FOR CART */}
            {checkoutStep === 'pix' && (
              <div className="space-y-4 animate-fadeIn">
                {orderPlaced && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Pedido confirmado! Realize o Pix e envie o comprovante.</span>
                  </div>
                )}

                {/* Identification Inputs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Seu Nome:</label>
                    <input
                      type="text"
                      placeholder="Ex: Gabriela"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-ruby-950 border border-ruby-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">WhatsApp:</label>
                    <input
                      type="tel"
                      placeholder="(21) 99999-9999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-ruby-950 border border-ruby-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                {/* Dynamic Pix Card for Exact Total Cart Amount */}
                <DynamicPixCard
                  amount={totalPrice}
                  pixKey={settings.pixKey}
                  beneficiaryName={settings.pixBeneficiary}
                  city="Rio de Janeiro"
                  txId={orderTxId || 'PEDIDO'}
                  description={`Pedido Boutique ${orderTxId}`}
                  title="QR Code Pix do Pedido"
                  subtitle="Valor total da sacola calculado dinamicamente"
                />
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          {cart.length > 0 && (
            <div className="border-t border-ruby-900/80 pt-4 space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total da Sacola:</span>
                <span className="font-extrabold text-gold-400 text-lg tabular-nums">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-900/60">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Embalagem 100% sigilosa ou retirada reservada no estúdio.</span>
              </div>

              {checkoutStep === 'cart' ? (
                <div className="space-y-2.5">
                  <button
                    onClick={handleStartPixCheckout}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-400 hover:to-amber-300 font-extrabold text-xs sm:text-sm text-ruby-950 flex items-center justify-center space-x-2 shadow-xl shadow-gold-500/20 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Comprar Agora (Pagar via Pix Dinâmico)</span>
                  </button>

                  <button
                    onClick={handleFinalizeWhatsAppOrder}
                    className="w-full py-3 rounded-xl border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-xs font-bold text-white flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Comprar & Enviar Pedido no WhatsApp</span>
                  </button>

                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <button
                      onClick={onClearCart}
                      className="text-gray-400 hover:text-ruby-300 transition cursor-pointer"
                    >
                      Esvaziar sacola
                    </button>
                    <button
                      onClick={handleCloseAndReset}
                      className="text-gold-400 hover:text-gold-300 transition cursor-pointer"
                    >
                      Continuar comprando
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleFinalizeWhatsAppOrder}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs sm:text-sm text-white flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/60 transition cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar Pedido & Enviar Comprovante</span>
                  </button>

                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full py-2 text-xs text-gray-400 hover:text-white transition"
                  >
                    Voltar para a lista de itens
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
