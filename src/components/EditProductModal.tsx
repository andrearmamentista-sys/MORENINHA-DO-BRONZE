import React, { useState } from 'react';
import { X, Check, Trash2, Gem, Image as ImageIcon } from 'lucide-react';
import { BoutiqueProduct } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { PhotoUploader } from './PhotoUploader';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BoutiqueProduct | null;
  onSave: (updatedProduct: BoutiqueProduct) => void;
  onDelete?: (productId: string) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  onDelete
}) => {
  if (!isOpen || !product) return null;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);
  const [desc, setDesc] = useState(product.desc || '');
  const [image, setImage] = useState(product.image);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...product,
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      desc: desc.trim(),
      image: image.trim()
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
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Produto da Boutique</h3>
            <p className="text-xs text-gray-400">
              Altere nome, categoria, preço e imagem deste item ao vivo na vitrine.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
          {/* Name */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Nome do Produto *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-medium block mb-1">Preço (R$) *</label>
              <input
                type="number"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-gray-300 font-medium block mb-1">Categoria *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Bronze & Brilho, Pós-Bronze..."
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Photo Uploader with phone upload support */}
          <PhotoUploader
            currentImageUrl={image}
            onImageSelected={(url) => setImage(url)}
            label="Foto do Produto (Envie direto do celular)"
            previewHeight="h-32"
          />

          {/* Description */}
          <div>
            <label className="text-gray-300 font-medium block mb-1">Descrição do Produto</label>
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
                      onDelete(product.id);
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
