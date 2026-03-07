'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const CATEGORY_ICONS: Record<string, string> = {
  Facial: '✨',
  Corporal: '💆',
  Salud: '🌿',
  Spa: '💎',
  default: '🧴',
};

/* ===============================
   Types
   =============================== */
interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number;
  is_active: boolean;
  visibility: 'public' | 'private';
  created_at: string;
  category_id: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

/* ===============================
   Page
   =============================== */
export default function AdminServicesPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [services, setServices] = useState<Service[]>([]);
  const [fetching, setFetching] = useState(true);

  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  type ToastType = 'success' | 'error';

  interface Toast {
    message: string;
    type: ToastType;
  }

  const [toast, setToast] = useState<Toast | null>(null);

  /* ===============================
     Auth guard
     =============================== */
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, profile, loading, router]);


/* ===============================
     Body class
     =============================== */
  useEffect(() => {
    document.body.classList.add("body-admin");
    return () => {
      document.body.classList.remove("body-admin");
    };
  }, []);

  /* ===============================
     Fetch services
     =============================== */
  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchServices();
    }
  }, [user, profile]);

  async function fetchServices() {
    setFetching(true);

    const { data } = await supabase
    .from('services')
    .select(`
      *,
      category:categories (
        id,
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false });

    if (data) setServices(data);
    setFetching(false);
  }

  /* ===============================
     Actions
     =============================== */
  async function toggleActive(service: Service) {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (error) {
      showToast('No se pudo actualizar el estado', 'error');
      return;
    }

    await fetchServices();
    showToast(
      service.is_active
        ? 'Servicio desactivado'
        : 'Servicio activado'
    );
  }

  async function toggleVisibility(service: Service) {
    const { error } = await supabase
      .from('services')
      .update({
        visibility: service.visibility === 'public' ? 'private' : 'public',
      })
      .eq('id', service.id);

    if (error) {
      showToast('No se pudo cambiar la visibilidad', 'error');
      return;
    }

    await fetchServices();
    showToast('Visibilidad actualizada');
  }

  function goToEdit(serviceId: string) {
    if (!serviceId) return;
    router.push(`/admin/services/${serviceId}`);
  }

  function toggleCategory(categoryName: string) {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  }

  function showToast(message: string, type: ToastType = 'success') {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function deleteService() {
  if (!serviceToDelete) return;

  setDeleting(true);

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceToDelete.id);

  setDeleting(false);

  if (error) {
    showToast('No se pudo eliminar el servicio', 'error');
    return;
  }

  showToast('Servicio eliminado correctamente');
  setServiceToDelete(null);
  await fetchServices();
}

  /* ===============================
     Group services by category
     =============================== */
  const servicesByCategory = useMemo(() => {
  const groups: Record<string, Service[]> = {};

  services.forEach(service => {
    const categoryName =
      service.category?.name || 'Sin categoría';

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }

    groups[categoryName].push(service);
  });

  return groups;
}, [services]);


  /* ===============================
     Loading state
     =============================== */
  if (loading || fetching) {
    return (
      <div className="container py-5">
        <p className="text-muted">Cargando servicios…</p>
      </div>
    );
  }

  /* ===============================
     Render
     =============================== */
  return (
    <div className="container py-5">
      <section className="admin-services-panel">
        {/* Panel Header */}
        <header className="panel-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="panel-title mb-1">Servicios</h1>
            <p className="panel-subtitle mb-0">
              Gestión de tratamientos y procedimientos
            </p>
          </div>

          <button className="btn btn-outline-primary btn-action" onClick={() => router.push('/admin/services/new')}>
            Nuevo servicio
          </button>
        </header>

        {/* Categories */}
        <div className="services-groups">
          {Object.entries(servicesByCategory).map(
            ([categoryId, categoryServices]) => (
              <section key={categoryId} className="services-group mb-5">
                {/* Category header */}
                <header
                  className="group-header mb-3"
                  onClick={() => toggleCategory(categoryId)}
                  role="button"
                >
                  <div className="group-title-wrapper">
                    <span className="group-icon">
                      {CATEGORY_ICONS[categoryId] || CATEGORY_ICONS.default}
                    </span>

                    <h2 className="group-title">
                      {categoryId}
                    </h2>
                  </div>

                  <div className="group-meta">
                    <span className="group-count">
                      {categoryServices.length} servicios
                    </span>

                    <span
                      className={`collapse-arrow ${
                        collapsedCategories[categoryId] ? 'collapsed' : ''
                      }`}
                    >
                      ▾
                    </span>
                  </div>
                </header>

                {/* Services list */}
                {!collapsedCategories[categoryId] && (
                  <div className="services-list">
                  {categoryServices.map(service => (
                    <article
                      key={service.id}
                      className="admin-service-card"
                    >
                      {/* Main info */}
                      <div className="service-main">
                        <div className="service-heading">
                          <h3 className="service-title">
                            {service.title}
                          </h3>

                          <span className="service-price">
                            ${service.price.toLocaleString()}
                          </span>
                        </div>

                        {service.description && (
                          <p className="service-description">
                            {service.description}
                          </p>
                        )}

                        <div className="service-meta">
                          <span
                            className={`status-pill ${
                              service.is_active
                                ? 'status-active'
                                : 'status-inactive'
                            }`}
                          >
                            {service.is_active ? 'Activo' : 'Inactivo'}
                          </span>

                          <span className="visibility-pill">
                            {service.visibility === 'public'
                              ? 'Público'
                              : 'Privado'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="service-actions">

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setServiceToDelete(service)}
                        >
                          Eliminar
                        </button>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleActive(service)}
                        >
                          {service.is_active ? 'Desactivar' : 'Activar'}
                        </button>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleVisibility(service)}
                        >
                          Visibilidad
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => goToEdit(service.id)}
                        >
                          Editar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                )}
              </section>
            )
          )}
        </div>
      </section>

      {toast && (
        <div className={`toast-premium ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {serviceToDelete &&
        typeof window !== 'undefined' &&
        createPortal(
          <>
            <div className="modal-backdrop fade show"></div>

            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
              style={{ zIndex: 99999 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content admin-confirm-modal premium-modal">

                  <div className="modal-header">
                    <h5 className="modal-title text-danger">
                      Confirmar eliminación
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setServiceToDelete(null)}
                    />
                  </div>

                  <div className="modal-body">
                    <p>Estás a punto de eliminar el servicio:</p>

                    <strong>{serviceToDelete.title}</strong>

                    <p className="text-muted mt-3 mb-0">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setServiceToDelete(null)}
                    >
                      Cancelar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={deleteService}
                    >
                      Sí, eliminar
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
