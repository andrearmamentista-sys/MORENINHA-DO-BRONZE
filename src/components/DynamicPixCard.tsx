import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ShieldCheck, Sparkles, Smartphone, QrCode } from 'lucide-react';
import { generatePixPayload, formatPixKeyDisplay, normalizePixKey } from '../utils/pix';

interface DynamicPixCardProps {
  amount: number;
  totalAmount?: number;
  pixKey?: string;
  beneficiaryName?: string;
  city?: string;
  txId?: string;
  description?: string;
  allowAmountToggle?: boolean;
  onAmountChange?: (newAmount: number) => void;
  title?: string;
  subtitle?: string;
}

export const DynamicPixCard: React.FC<DynamicPixCardProps> = ({
  amount,
  totalAmount,
  pixKey = '21976333205',
  beneficiaryName = 'Moreninha do Bronze',
  city = 'Rio de Janeiro',
  txId = 'MBRONZE',
  description = 'Moreninha do Bronze',
  allowAmountToggle = false,
  onAmountChange,
  title = 'Pagamento Instantâneo via Pix',
  subtitle = 'Aponte a câmera do seu aplicativo de banco para pagar instantaneamente'
}) => {
  const [selectedMode, setSelectedMode] = useState<'signal' | 'total'>('signal');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Active key guaranteed
  const activeKey = pixKey && !pixKey.includes('moreninhabronze-pix-oficial') ? pixKey : '21976333205';

  // Compute active payment amount
  const activeAmount = useMemo(() => {
    if (allowAmountToggle && totalAmount && selectedMode === 'total') {
      return totalAmount;
    }
    return amount;
  }, [amount, totalAmount, allowAmountToggle, selectedMode]);

  // Generate dynamic Pix BR Code payload
  const pixPayload = useMemo(() => {
    return generatePixPayload({
      pixKey: activeKey,
      merchantName: beneficiaryName || 'MORENINHA DO BRONZE',
      merchantCity: city || 'RIO DE JANEIRO',
      amount: activeAmount,
      txId: txId || 'MBRONZE',
      description
    });
  }, [activeKey, beneficiaryName, city, activeAmount, txId, description]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
  };

  const handleCopyRawKey = () => {
    navigator.clipboard.writeText(activeKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleModeChange = (mode: 'signal' | 'total') => {
    setSelectedMode(mode);
    if (onAmountChange) {
      onAmountChange(mode === 'total' && totalAmount ? totalAmount : amount);
    }
  };

  return (
    <div className="bg-gradient-to-br from-ruby-900/60 via-ruby-950 to-ruby-900/40 border border-gold-400/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ruby-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shadow-inner">
            PIX
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{title}</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            </h4>
            <p className="text-[11px] text-gray-300 font-light">{subtitle}</p>
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
            {activeAmount > 0 ? 'Valor do Pagamento' : 'Valor Livre'}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-emerald-400 tabular-nums">
            {activeAmount > 0 ? `R$ ${activeAmount.toFixed(2).replace('.', ',')}` : 'A definir no banco'}
          </span>
        </div>
      </div>

      {/* Amount Toggle for Bookings: Signal vs Total */}
      {allowAmountToggle && totalAmount && totalAmount > amount && (
        <div className="bg-ruby-950/80 p-1.5 rounded-xl border border-ruby-800 flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => handleModeChange('signal')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              selectedMode === 'signal'
                ? 'bg-gold-500 text-ruby-950 font-bold shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Sinal de Reserva (10%): R$ {amount.toFixed(2).replace('.', ',')}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('total')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              selectedMode === 'total'
                ? 'bg-gold-500 text-ruby-950 font-bold shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Valor Total (100%): R$ {totalAmount.toFixed(2).replace('.', ',')}
          </button>
        </div>
      )}

      {/* Central QR Code & Instructions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-ruby-950/70 p-3.5 rounded-xl border border-ruby-800/80">
        {/* Scannable High-Contrast QR Code */}
        <div className="p-3 bg-white rounded-xl shadow-2xl shrink-0 flex items-center justify-center border-2 border-emerald-500/50">
          <QRCodeSVG
            value={pixPayload}
            size={160}
            level="M"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-2 text-xs text-gray-300 flex-1">
          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <span className="text-[11px] leading-tight">
              Abra o aplicativo do seu banco (Nubank, Itaú, Inter, Bradesco, etc.) e acesse a área <strong>Pix</strong>.
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <span className="text-[11px] leading-tight">
              Escolha <strong>"Ler QR Code"</strong> e aponte a câmera do celular para a imagem ao lado.
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </span>
            <span className="text-[11px] leading-tight">
              {activeAmount > 0 ? (
                <>
                  Confirme o valor de{' '}
                  <strong className="text-emerald-400">
                    R$ {activeAmount.toFixed(2).replace('.', ',')}
                  </strong>{' '}
                  para <strong>{beneficiaryName || 'Moreninha do Bronze'}</strong>.
                </>
              ) : (
                <>
                  Digite o valor desejado e confirme o envio para{' '}
                  <strong>{beneficiaryName || 'Moreninha do Bronze'}</strong>.
                </>
              )}
            </span>
          </div>

          {/* Key badge with one-click copy */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chave: <strong>{formatPixKeyDisplay(activeKey)}</strong></span>
            </div>

            <button
              type="button"
              onClick={handleCopyRawKey}
              className="text-[10px] px-2 py-1 rounded-lg border border-gold-400/40 text-gold-300 hover:bg-gold-500 hover:text-ruby-950 transition cursor-pointer flex items-center gap-1 font-semibold"
            >
              {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey ? 'Chave Copiada!' : 'Copiar Apenas a Chave'}</span>
            </button>
          </div>

          <div className="pt-1 flex items-center gap-1.5 text-[10px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Padrão BR Code oficial compatível com todos os bancos do Brasil</span>
          </div>
        </div>
      </div>

      {/* Copy and Paste Field */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-gray-300 font-medium flex items-center justify-between">
          <span>Código Pix Copia e Cola (para pagar no mesmo celular):</span>
          <span className="text-[10px] text-gold-400/90 font-mono">TxID: {txId}</span>
        </label>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={pixPayload}
            className="w-full bg-ruby-950 border border-ruby-800 rounded-xl px-3 py-2 text-[11px] text-gray-300 font-mono focus:outline-none selection:bg-gold-500 selection:text-black overflow-hidden text-ellipsis"
          />

          <button
            type="button"
            onClick={handleCopyPayload}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-md ${
              copiedPayload
                ? 'bg-emerald-600 text-white'
                : 'bg-gold-500 hover:bg-gold-400 text-ruby-950 hover:shadow-gold-500/20'
            }`}
          >
            {copiedPayload ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
