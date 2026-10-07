import React, { useState } from 'react';
import { X, QrCode, Sparkles, Smartphone, Check } from 'lucide-react';
import { DynamicPixCard } from './DynamicPixCard';
import { StudioSettings } from '../types';

interface QuickPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  defaultAmount?: number;
}

export const QuickPixModal: React.FC<QuickPixModalProps> = ({
  isOpen,
  onClose,
  settings,
  defaultAmount = 25
}) => {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickAmounts = [25, 40, 60, 130];

  const handleSelectQuick = (val: number) => {
    setAmount(val);
    setIsCustom(false);
    setCustomAmountInput('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
    setCustomAmountInput(e.target.value);
    const num = parseFloat(raw);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
      setIsCustom(true);
    } else {
      setAmount(0);
      setIsCustom(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel max-w-lg w-full rounded-3xl p-5 sm:p-6 border border-ruby-700/80 shadow-2xl relative my-auto space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-xl bg-ruby-950/70 border border-ruby-800 transition cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-ruby-800/80 pb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-inner">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-1.5">
              <span>QR Code Pix do Studio</span>
              <Sparkles className="w-4 h-4 text-gold-400" />
            </h3>
            <p className="text-xs text-gray-400">
              Aponte a câmera do celular para pagar diretamente na chave <strong>21976333205</strong>
            </p>
          </div>
        </div>

        {/* Quick Amount Selectors */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-300 block">
            Selecione ou digite o valor a pagar:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectQuick(val)}
                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  amount === val && !isCustom
                    ? 'bg-gold-500 text-ruby-950 border-gold-400 shadow-md'
                    : 'bg-ruby-950/80 text-gray-300 border-ruby-800 hover:border-gold-400/50'
                }`}
              >
                R$ {val}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="pt-1.5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gold-400">
                R$
              </span>
              <input
                type="text"
                placeholder="Outro valor (ex: 80,00 ou deixe em branco para valor livre)"
                value={customAmountInput}
                onChange={handleCustomChange}
                className="w-full bg-ruby-950 border border-ruby-800 focus:border-gold-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Pix Card Component with scannable QR Code */}
        <DynamicPixCard
          amount={amount}
          pixKey={settings.pixKey || '21976333205'}
          beneficiaryName={settings.pixBeneficiary || 'Moreninha do Bronze'}
          city="Rio de Janeiro"
          txId="MBRONZE"
          title="QR Code Oficial para Leitura"
          subtitle="Abra o app do seu banco, escolha Pix &gt; Ler QR Code e aponte para a imagem abaixo"
        />

        {/* Footnote */}
        <div className="text-center pt-1">
          <p className="text-[11px] text-gray-400">
            Dúvidas? Chave cadastrada como <strong>Telefone Celular</strong>: (21) 97633-3205
          </p>
        </div>
      </div>
    </div>
  );
};
