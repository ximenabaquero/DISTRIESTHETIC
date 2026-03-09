'use client';

import { useState } from 'react';

interface LoginPanelProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginPanel({ onLogin }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onLogin(email, password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#060d18] px-4 overflow-hidden">
      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(26,108,246,0.10) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-sm relative z-10">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1a6cf6]/20 border border-[#1a6cf6]/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#1a6cf6]">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center">
            <span className="text-[#f0f4ff] text-base font-bold tracking-wide">DistriEsthetic</span>
            <p className="text-[#8899bb] text-xs mt-0.5">Panel de administración</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0f1c2e] border border-white/[0.08] rounded-2xl shadow-2xl p-7">
          <p className="text-[#8899bb] text-sm mb-5">Ingresa tus credenciales para continuar.</p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[#a0b0cc] text-xs font-medium mb-1.5">
              Correo electrónico
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              type="email"
              placeholder="admin@ejemplo.com"
              className="w-full bg-[#080f1c] border border-white/[0.1] text-[#f0f4ff] placeholder:text-[#3a4a60] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#1a6cf6] focus:ring-1 focus:ring-[#1a6cf6]/40 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[#a0b0cc] text-xs font-medium mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-[#080f1c] border border-white/[0.1] text-[#f0f4ff] placeholder:text-[#3a4a60] px-4 py-2.5 pr-11 rounded-xl text-sm focus:outline-none focus:border-[#1a6cf6] focus:ring-1 focus:ring-[#1a6cf6]/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a4a60] hover:text-[#8899bb] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-[#1a6cf6] hover:bg-[#1558d6] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            Iniciar sesión
          </button>
        </div>

        <p className="text-center text-[#2a3a50] text-xs mt-6">
          Acceso restringido · Solo personal autorizado
        </p>
      </div>
    </div>
  );
}