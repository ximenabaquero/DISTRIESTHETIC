import { ReactNode } from 'react';
import { SiteNav } from '@/components/SiteNav';

interface AdminLayoutProps {
  children: ReactNode;
  loggedIn: boolean;
  onLogout: () => void;
  sessionEmail: string | null;
}

export default function AdminLayout({ children, loggedIn, onLogout, sessionEmail }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Usar la navegación unificada del sitio */}
      <SiteNav />

      {/* Admin info bar - Barra de información del admin debajo de la nav principal */}
      {loggedIn && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700">Panel de Administración</span>
              </div>
              <div className="flex items-center gap-3">
                {sessionEmail && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/50">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">
                        {sessionEmail[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-700 hidden sm:inline max-w-[140px] truncate">{sessionEmail}</span>
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-150"
                  title="Cerrar sesión"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}