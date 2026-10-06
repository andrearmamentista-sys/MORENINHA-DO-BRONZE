import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { Service, ServiceHourOption } from '../types';
import { PhotoUploader } from './PhotoUploader';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (updatedService: Service) => void;
  onDelete?: (serviceId: string) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
  onDelete
}) => {
  if (!isOpen || !service) return null;

  const isHourly =
    service.title.toLowerCase().includes('marquinha') ||
    service.title.toLowerCase().includes('fita') ||
    Boolean(service.hourOptions && service.hourOptions.length > 0);

  const [title, setTitle] = useState(service.title);
  const [price, setPrice] = useState(service.price);
  const [duration, setDuration] = useState(service.duration);
  const [desc, setDesc] = useState(service.desc);
  const [phototype, setPhototype] = useState(service.phototypeRecommended || '');
  const [image, setImage] = useState(service.image);

  // Hour options pricing state
  const existing1h = service.hourOptions?.find((o) => o.hours === 1)?.price ?? 25;
  const existing2h = service.hourOptions?.find((o) => o.hours === 2)?.price ?? 40;
  const existing3h = service.hourOptions?.find((o) => o.hours === 3)?.price ?? 60;

  const [price1h, setPrice1h] = useState(existing1h);
  const [price2h, setPrice2h] = useState(existing2h);
  const [price3h, setPrice3h] = useState(existing3h);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setTitle(service.title);
    setPrice(service.price);
    setDuration(service.duration);
    setDesc(service.desc);
    setPhototype(service.phototypeRecommended || '');
    setImage(service.image);

    const h1 = service.hourOptions?.find((o) => o.hours === 1)?.price ?? (service.price || 25);
    const h2 = service.hourOptions?.find((o) => o.hours === 2)?.price ?? 40;
    const h3 = service.hourOptions?.find((o) => o.hours === 3)?.price ?? 60;
    setPrice1h(h1);
    setPrice2h(h2);
    setPrice3h(h3);
    setIsConfirmingDelete(false);
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let updatedHourOptions: ServiceHourOption[] | undefined = undefined;

    if (isHourly) {
      updatedHourOptions = [
        {
          hours: 1,
          label: '1 Hora',
          duration: '60 min',
          price: Number(price1h),
          originalPrice: Math.round(Number(price1h) * 1.35),
          discountBadge: 'Sessão Express',
          tag: 'Sessão Express'
        },
        {
          hours: 2,
          label: '2 Horas',
          duration: '120 min',
          price: Number(price2h),
          originalPrice: Math.round(Number(price2h) * 1.35),
          discountBadge: `Economize R$ ${Math.max(0, Math.round(Number(price1h) * 2 - Number(price2h)))}`,
          tag: 'Dourado Radiante'
        },
        {
          hours: 3,
          label: '3 Horas',
          duration: '180 min',
          price: Number(price3h),
          originalPrice: Math.round(Number(price3h) * 1.4),
          discountBadge: `Mais Pedida 🔥`,
          tag: 'Mais Pedida 🔥',
          isPopular: true
        }
      ];
    }

    onSave({
      ...service,
      title: title.trim(),
      price: isHourly ? Number(price1h) : Number(price),
      duration: isHourly ? '1h a 3h' : duration.trim(),
      desc: desc.trim(),
      phototypeRecommended: phototype.trim(),
      image: image.trim(),
      hourOptions: updatedHourOptions
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-ruby-700 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-ruby-800/80 pb-3">
          <div className="w-8 h-8 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Procedimento</h3>
            <p className="text-xs text-gray-400">
              Personalize o nome, imagem e defina os valores que desejar.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          {/* Title */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Título do Procedimento *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* If Service has Hourly Options (e.g. Bronze Marquinha VIP Fita) */}
          {isHourly ? (
            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-sky-400/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Valores Editáveis por Duração (1h, 2h e 3h):</span>
                </span>
                <span className="text-[10px] text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-500/30 font-semibold">
                  Tabela VIP
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                    1 Hora (R$) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={price1h}
                    onChange={(e) => setPrice1h(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-sky-500/50 focus:border-gold-400 rounded-xl px-2.5 py-2 text-white font-bold text-center text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                    2 Horas (R$) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={price2h}
                    onChange={(e) => setPrice2h(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-sky-500/50 focus:border-gold-400 rounded-xl px-2.5 py-2 text-white font-bold text-center text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 font-semibold block mb-1">
                    3 Horas (R$) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={price3h}
                    onChange={(e) => setPrice3h(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-sky-500/50 focus:border-gold-400 rounded-xl px-2.5 py-2 text-white font-bold text-center text-sm"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-300">
                Você pode alterar esses valores livremente. O cliente verá esses preços exatos ao selecionar cada hora.
              </p>
            </div>
          ) : (
            /* Single Price & Duration (e.g. Banho de Lua Dourado) */
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 font-medium block mb-1">Valor da Sessão (R$) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="text-gray-300 font-medium block mb-1">Duração *</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 40 min"
                  className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          )}

          {/* Recommended Phototype */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Fototipo Recomendado</label>
            <input
              type="text"
              value={phototype}
              onChange={(e) => setPhototype(e.target.value)}
              placeholder="Ex: Fototipo II, III, IV e V"
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Photo Uploader with phone upload support */}
          <PhotoUploader
            currentImageUrl={image}
            onImageSelected={(url) => setImage(url)}
            label="Foto do Procedimento (Envie direto do celular ou cole URL)"
            previewHeight="h-32"
          />

          {/* Description */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Descrição</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-ruby-800/80 flex items-center justify-between">
            {onDelete ? (
              !isConfirmingDelete ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-2 rounded-xl text-ruby-400 hover:text-white hover:bg-ruby-900/50 border border-ruby-800 transition flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-red-950/80 border border-red-500/50">
                  <span className="text-[11px] text-red-300 font-bold px-1.5">Confirmar?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(service.id);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] cursor-pointer"
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-gray-300 text-[11px] cursor-pointer"
                  >
                    Não
                  </button>
                </div>
              )
            ) : (
              <div />
            )}

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
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
