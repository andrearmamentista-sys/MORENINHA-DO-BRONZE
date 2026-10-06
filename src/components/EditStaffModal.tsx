import React, { useState, useEffect } from 'react';
import { X, Check, User, Phone, Sparkles } from 'lucide-react';
import { StaffMember } from '../types';
import { PhotoUploader } from './PhotoUploader';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember: StaffMember | null;
  onSave: (updatedStaff: StaffMember) => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  isOpen,
  onClose,
  staffMember,
  onSave
}) => {
  if (!isOpen || !staffMember) return null;

  const [name, setName] = useState(staffMember.name);
  const [role, setRole] = useState(staffMember.role);
  const [specialty, setSpecialty] = useState(staffMember.specialty);
  const [bio, setBio] = useState(staffMember.bio);
  const [phone, setPhone] = useState(staffMember.phone || '');
  const [image, setImage] = useState(staffMember.image);

  useEffect(() => {
    if (staffMember) {
      setName(staffMember.name);
      setRole(staffMember.role);
      setSpecialty(staffMember.specialty);
      setBio(staffMember.bio);
      setPhone(staffMember.phone || '');
      setImage(staffMember.image);
    }
  }, [staffMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...staffMember,
      name: name.trim(),
      role: role.trim() || 'Especialista em Bronze',
      specialty: specialty.trim() || 'Bronzeamento Personalizado',
      bio: bio.trim(),
      phone: phone.trim(),
      image
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-ruby-700/60 space-y-4 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-ruby-800/80 pb-3">
          <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center font-bold text-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Editar Dados da Profissional</h3>
            <p className="text-xs text-gray-400">
              Altere o nome, legenda/cargo, especialidade, foto e WhatsApp da especialista.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photo Uploader */}
          <PhotoUploader
            currentImageUrl={image}
            onImageSelected={(url) => setImage(url)}
            label="Foto da Especialista (Envie do aparelho ou cole link)"
            previewHeight="h-36"
          />

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">
                Nome da Profissional *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Guedes"
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Celular</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 5521998765432"
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Role / Legenda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">
                Cargo / Legenda Superior *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Personal Bronze Master"
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">
                Especialidade Principal *
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Fita Milimétrica & Melanina"
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <label className="text-gray-300 font-semibold block mb-1">
              Biografia / Descrição da Profissional
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Descreva a experiência e formação da profissional..."
              className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl px-3 py-2 text-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-ruby-800/80 flex items-center justify-end space-x-2">
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
              <span>Salvar Dados da Profissional</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
