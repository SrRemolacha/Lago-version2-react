'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import '@/styles/admin-dashboard.css';

export default function AdminDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // No autenticado
    if (!user) {
      router.replace('/login');
      return;
    }

    // No es admin
    if (profile?.role !== 'admin') {
      router.replace('/login');
      return;
    }

    // Admin inactivo o eliminado
    if (!profile?.is_active || profile?.deleted_at) {
      alert('Tu cuenta administrativa se encuentra inactiva.');
      signOut();
      router.replace('/login');
      return;
    }

  }, [user, profile, loading, router, signOut]);

  if (loading) {
    return <div className="p-5">Cargando panel…</div>;
  }

  if (
    !user ||
    profile?.role !== 'admin' ||
    !profile?.is_active ||
    profile?.deleted_at
  ) {
    return null;
  }


  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-header-title">
          Panel de Administración
        </h1>

        <button
          className="admin-header-action"
          onClick={signOut}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Main */}
      <main className="admin-main container">
        <div className="admin-intro">
          <h5>Resumen general</h5>
          <p>Gestión central del spa / clínica estética</p>
        </div>

        <div className="row g-4">
          {/* Servicios */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="admin-card">
              <i className="bi bi-droplet-half admin-card-icon" />
              <h6 className="admin-card-title">Servicios</h6>
              <p className="admin-card-text">
                Crear, editar y administrar tratamientos
              </p>
              <button
                className="admin-card-action"
                onClick={() => router.push('/admin/services')}
              >
                Gestionar
              </button>
            </div>
          </div>

          {/* Administradores */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="admin-card">
              <i className="bi bi-people admin-card-icon" />
              <h6 className="admin-card-title">Administradores</h6>
              <p className="admin-card-text">
                Control de accesos y usuarios admin
              </p>
              <button
                className="admin-card-action"
                onClick={() => router.push('/admin/services/users')}
              >
                Ver admins
              </button>
            </div>
          </div>

          {/* Facturación */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="admin-card">
              <i className="bi bi-receipt admin-card-icon" />
              <h6 className="admin-card-title">Facturación</h6>
              <p className="admin-card-text">
                Generar y gestionar facturas
              </p>
              <button
                className="admin-card-action"
                onClick={() => router.push('/admin/billing')}
              >
                Crear factura
              </button>
            </div>
          </div>

          {/* Categorías */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="admin-card">
              <i className="bi bi-tags admin-card-icon" />
              <h6 className="admin-card-title">Categorías</h6>
              <p className="admin-card-text">
                Clasificación de servicios
              </p>
              <button
                className="admin-card-action"
                onClick={() => router.push('/admin/categories')}
              >
                Gestionar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
