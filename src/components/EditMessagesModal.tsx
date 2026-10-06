import React, { useState } from 'react';
import { X, Check, MessageSquare, RotateCcw, Sparkles, Heart, Smartphone } from 'lucide-react';
import { StudioSettings } from '../types';

interface EditMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onSaveMessages: (clientTemplate: string, staffTemplate: string) => void;
}

export const EditMessagesModal: React.FC<EditMessagesModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveMessages
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'client' | 'staff'>('client');

  const defaultClientTemplate =
    `✨🌸 *Oi, minha linda {primeiro_nome}!* 🌸✨\n\n` +
    `Que alegria imensa ter você com a gente no *{estudio}*! Seu horário especial foi reservado com todo o amor e carinho do mundo! 🥰💖\n\n` +
    `📋 *Resumo do seu atendimento VIP:*\n` +
    `✨ *Procedimento:* {servico}\n` +
    `📅 *Data marcada:* {data}\n` +
    `⏰ *Horário:* {horario}\n` +
    `👑 *Profissional:* {profissional}\n` +
    `📍 *Endereço:* {local}\n` +
    `💰 *Investimento:* R$ {valor} ({pagamento})\n\n` +
    `☀️ *Diquinhas com carinho para o seu bronze ficar um espetáculo:*\n` +
    `• Beba bastante água nas horas anteriores para a pele ficar bem nutrida.\n` +
    `• Faça uma esfoliação corporal leve 24h antes.\n` +
    `• No dia do atendimento, venha com roupinha soltinha e sem hidratante, perfume ou desodorante.\n\n` +
    `Estamos preparando um espaço climatizado, acolhedor e super cheiroso para você relaxar e sair daqui radiante, dourada e com a marquinha dos seus sonhos! ✨👙\n\n` +
    `Se precisar alterar algo ou tiver qualquer dúvida, é só nos chamar aqui. Um beijo bem carinhoso e até lá! 💋✨`;

  const defaultStaffTemplate =
    `🚨✨ *NOVO AGENDAMENTO CONFIRMADO NO APP!* ✨🚨\n\n` +
    `Olá, *{profissional}*! Uma cliente acabou de garantir horário na sua agenda:\n\n` +
    `👤 *Cliente:* {cliente}\n` +
    `📱 *WhatsApp:* {telefone}\n` +
    `✨ *Procedimento:* {servico}\n` +
    `📅 *Data:* {data}\n` +
    `⏰ *Horário:* {horario}\n` +
    `🎨 *Fototipo Declarado:* {fototipo}\n` +
    `🤰 *Gestante/Lactante:* {gestante}\n` +
    `🩺 *Saúde/Observações:* {saude}\n` +
    `💰 *Valor Total:* R$ {valor} ({pagamento})\n\n` +
    `Por favor, reserve a sala e os materiais para este atendimento. A ficha completa já está disponível no painel administrativo!`;

  const [clientTemplate, setClientTemplate] = useState(
    settings.customClientMessageTemplate || defaultClientTemplate
  );
  const [staffTemplate, setStaffTemplate] = useState(
    settings.customStaffMessageTemplate || defaultStaffTemplate
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMessages(clientTemplate.trim(), staffTemplate.trim());
    onClose();
  };

  const handleResetCurrent = () => {
    if (activeTab === 'client') {
      setClientTemplate(defaultClientTemplate);
    } else {
      setStaffTemplate(defaultStaffTemplate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-6 border border-ruby-700 space-y-4 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-ruby-800/80 pb-3">
          <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center font-bold text-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Mensagens de Confirmação</h3>
            <p className="text-xs text-gray-400">
              Personalize o texto que vai para a cliente e o alerta que chega no celular da profissional.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-ruby-800/60 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'client'
                ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Mensagem Carinhosa (Cliente)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-ruby-900 text-gold-300 border border-ruby-700 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Alerta da Profissional (Celular)</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          {activeTab === 'client' ? (
            <div className="space-y-2">
              <label className="text-gray-300 font-medium block">
                Texto da Mensagem para o WhatsApp da Cliente:
              </label>
              <textarea
                rows={11}
                required
                value={clientTemplate}
                onChange={(e) => setClientTemplate(e.target.value)}
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2.5 text-white font-mono text-[11px] leading-relaxed"
              />
              <div className="p-2.5 rounded-xl bg-ruby-950/80 border border-ruby-800 text-[10px] text-gray-400 space-y-1">
                <span className="font-semibold text-gold-400 block">Tags disponíveis que se preenchem sozinhas:</span>
                <p className="font-mono text-gray-300">
                  {`{cliente}, {primeiro_nome}, {servico}, {data}, {horario}, {profissional}, {local}, {valor}, {pagamento}, {estudio}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-gray-300 font-medium block">
                Texto do Alerta que chega no WhatsApp da Especialista:
              </label>
              <textarea
                rows={11}
                required
                value={staffTemplate}
                onChange={(e) => setStaffTemplate(e.target.value)}
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2.5 text-white font-mono text-[11px] leading-relaxed"
              />
              <div className="p-2.5 rounded-xl bg-ruby-950/80 border border-ruby-800 text-[10px] text-gray-400 space-y-1">
                <span className="font-semibold text-gold-400 block">Tags disponíveis:</span>
                <p className="font-mono text-gray-300">
                  {`{profissional}, {cliente}, {telefone}, {servico}, {data}, {horario}, {fototipo}, {gestante}, {saude}, {valor}, {pagamento}, {estudio}`}
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-ruby-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetCurrent}
              className="text-xs text-gray-400 hover:text-gold-300 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Mensagem Padrão</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-ruby-700 text-gray-300 hover:text-white hover:bg-ruby-900/50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="ruby-gradient-btn px-5 py-2 rounded-xl text-white font-semibold shadow transition cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Mensagens</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
