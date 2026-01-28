import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminLayoutProps {
  children: ReactNode;
  loggedIn: boolean;
  onLogout: () => void;
  sessionEmail: string | null;
}

export default function AdminLayout({ children, loggedIn, onLogout, sessionEmail }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/logodistsin.png" alt="logo" width={150} height={60} />
            <span className="font-bold text-xl text-blue-600">DISTRIESTHETIC Admin</span>
          </div>
          <div className="flex gap-4 items-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Inicio</Link>
            <Link href="/productos" className="text-gray-600 hover:text-blue-600">Productos</Link>
            {loggedIn && <button onClick={onLogout} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Salir</button>}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {children}
      </div>
    </div>
  );
}