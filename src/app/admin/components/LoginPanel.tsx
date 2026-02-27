'use client';

import { useState } from 'react';

interface LoginPanelProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginPanel({ onLogin }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) return;
    onLogin(email, password);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(99,179,237,0.15) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99,179,237,0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-sky-400 opacity-5 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0 0 1.5h.007a.75.75 0 0 0 0-1.5H12Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight text-lg">MediSupply</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">Panel de administración</p>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Gestiona tu<br />inventario médico<br />con confianza.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Acceso exclusivo para administradores autorizados. Toda la actividad queda registrada y auditada.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: '500+', label: 'Clínicas activas' },
            { value: '99.9%', label: 'Disponibilidad' },
            { value: 'INVIMA', label: 'Certificado' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-slate-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0 0 1.5h.007a.75.75 0 0 0 0-1.5H12Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-semibold tracking-tight">MediSupply</span>
          </div>

          <h2 className="text-white text-2xl font-bold mb-1">Acceso Administrador</h2>
          <p className="text-slate-500 text-sm mb-8">Ingresa tus credenciales para continuar.</p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
              Correo electrónico
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              type="email"
              placeholder="admin@clinica.com"
              className="w-full bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 px-4 py-3 pr-11 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
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
            disabled={!email || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
          >
            Iniciar sesión
          </button>

          {/* Footer */}
          <p className="text-center text-slate-600 text-xs mt-8">
            Acceso restringido. Solo personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
}