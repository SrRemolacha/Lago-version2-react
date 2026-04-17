'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import '@/styles/admin-dashboard.css';

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="admin-dashboard">

      <header className="admin-header">
        <h1 className="admin-header-title">
          Panel de Administración
        </h1>

        <button
          className="admin-header-action"
          onClick={handleSignOut}
        >
          Cerrar sesión
        </button>
      </header>

      <main className="admin-main container">

        <div className="admin-intro">
          <h5>Resumen general</h5>
          <p>Gestión central del spa / clínica estética</p>
        </div>

        <div className="row g-4">

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