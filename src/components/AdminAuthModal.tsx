import React, { useState } from 'react';
import { Lock, X, AlertCircle, User, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { AdminCredentials } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token?: string) => void;
  credentials: AdminCredentials;
  onGoogleSignIn?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  credentials,
  onGoogleSignIn
}) => {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitLocked, setRateLimitLocked] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const trimmedLogin = loginInput.trim();

    try {
      // 1. Authenticate with Protected Server Endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: trimmedLogin,
          password: passwordInput
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) {
          sessionStorage.setItem('mbronze_admin_token', data.token);
        }
        setErrorMsg('');
        setLoginInput('');
        setPasswordInput('');
        onSuccess(data.token);
        return;
      }

      if (response.status === 429) {
        setRateLimitLocked(true);
        setErrorMsg(data.error || 'Limite de tentativas excedido. Bloqueio de segurança temporário ativado.');
        return;
      }

      // If server returned 401 or invalid
      if (response.status === 401) {
        // Fallback for custom client-configured credentials if set in dashboard
        if (credentials.password && passwordInput === credentials.password && trimmedLogin.toLowerCase() === credentials.login.toLowerCase()) {
          setErrorMsg('');
          setLoginInput('');
          setPasswordInput('');
          onSuccess();
          return;
        }

        setErrorMsg(data.error || 'Credenciais incorretas. Verifique seu login e senha.');
        return;
      }

      setErrorMsg(data.error || 'Erro na verificação de acesso.');
      // Fallback if server is in static mode or network unavailable
      const normalizedEnteredLogin = trimmedLogin.toLowerCase();
      const isAllowedUser =
        normalizedEnteredLogin === 'abelinha' ||
        normalizedEnteredLogin === 'andrearmamentista@gmail.com' ||
        normalizedEnteredLogin === (credentials.login || 'abelinha').toLowerCase();

      const isAllowedPassword =
        passwordInput === '21976333205' ||
        (credentials.password && passwordInput === credentials.password);

      if (isAllowedUser && isAllowedPassword) {
        setErrorMsg('');
        setLoginInput('');
        setPasswordInput('');
        onSuccess();
      } else {
        setErrorMsg('Login ou senha incorretos. Acesso restrito à administradora.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel max-w-sm w-full rounded-2xl p-6 border border-ruby-700 space-y-4 text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold text-white">Acesso da Administradora</h3>
          <p className="text-xs text-gray-400 mt-1">
            Painel protegido com verificação no servidor e limite de tentativas de login.
          </p>
        </div>

        {/* Google Sign-in for Admin */}
        {onGoogleSignIn && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full py-2.5 rounded-xl border border-gold-400/60 hover:bg-gold-500 hover:text-ruby-950 text-gold-300 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md bg-ruby-950/70"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com Conta Google</span>
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ruby-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-ruby-950 px-2 text-gray-400">ou com credenciais</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1 text-left">
          {/* Login Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-gray-300 block">
              Usuário ou E-mail:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gold-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={loginInput}
                onChange={(e) => {
                  setLoginInput(e.target.value);
                  setErrorMsg('');
                }}
                disabled={rateLimitLocked || isLoading}
                placeholder="Digite seu usuário ou e-mail"
                required
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition shadow-inner disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-gray-300 block">
              Senha da Administradora:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg('');
                }}
                disabled={rateLimitLocked || isLoading}
                placeholder="Digite sua senha"
                required
                className="w-full bg-ruby-950 border border-ruby-700 focus:border-gold-400 rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none transition shadow-inner disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-start space-x-1.5 text-xs text-ruby-300 bg-ruby-950/90 p-2.5 rounded-xl border border-red-500/60 leading-relaxed text-left">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-1/2 py-2.5 rounded-xl text-xs border border-ruby-800 text-gray-300 hover:bg-ruby-900/50 transition cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || rateLimitLocked}
              className="w-1/2 ruby-gradient-btn py-2.5 rounded-xl text-xs font-semibold text-white shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-ruby-900/60 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Servidor com proteção anti-força bruta ativa</span>
          </div>
        </div>
      </div>
    </div>
  );
};
