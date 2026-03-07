'use client';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

import '../globals.css';
import '../styles/login.css';
import '../styles/admin-theme.css';
import '../styles/admin-services.css';
import '../styles/admin-forms.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();

  // 1️⃣ Mientras carga auth → no renderizar nada sensible
  if (loading) {
    return (
      <div className="admin-loading">
        <span className="spinner-border" />
      </div>
    );
  }

  // 2️⃣ No autenticado o no admin → redirect inmediato
  if (!user || profile?.role !== 'admin') {
    redirect('/login');
  }

  // 3️⃣ Autorizado
  return <>{children}</>;
}
