'use client';

import { useState } from 'react';

interface LoginPanelProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginPanel({ onLogin }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = () => {
    if (!email || !password) {
      alert('Por favor completa ambos campos.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Acceso Administrador</h2>
      <p className="text-sm text-gray-600 mb-6">Ingresa tu correo y contraseña.</p>
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        type="email" 
        placeholder="Correo electrónico" 
        className="w-full border px-4 py-2 rounded mb-4 text-gray-900 placeholder:text-gray-700" 
      />
      <input 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        type="password" 
        placeholder="Contraseña" 
        className="w-full border px-4 py-2 rounded mb-4 text-gray-900 placeholder:text-gray-700" 
      />
      <button 
        onClick={handleSubmit} 
        disabled={!email || !password} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-40"
      >
        Iniciar sesión
      </button>
    </div>
  );
}