'use client';

import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import styles from './AdminUsers.module.css';

type Profile = {
  id: string;
  role: string;
  display_name: string | null;
  is_active: boolean;
  deleted_at: string | null;
};

export default function UserActions({
  user,
  refresh,
}: {
  user: Profile;
  refresh: () => void;
}) {
  const supabase = createSupabaseBrowserClient();
  const { user: currentUser } = useAuth();

  async function getActiveAdminCount() {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')
      .eq('is_active', true)
      .is('deleted_at', null);

    return count || 0;
  }

  async function toggleActive() {
    if (currentUser?.id === user.id) {
      alert('No puedes modificar tu propio estado.');
      return;
    }

    if (user.is_active) {
      const count = await getActiveAdminCount();

      if (count <= 1) {
        alert('No puedes desactivar el último administrador activo.');
        return;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);

    if (error) {
      alert('Error al actualizar estado.');
      return;
    }

    refresh();
  }

  async function softDelete() {
    if (currentUser?.id === user.id) {
      alert('No puedes eliminar tu propio usuario.');
      return;
    }

    const count = await getActiveAdminCount();

    if (user.is_active && count <= 1) {
      alert('No puedes eliminar el último administrador activo.');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        deleted_at: new Date().toISOString(),
        is_active: false,
      })
      .eq('id', user.id);

    if (error) {
      alert('Error al eliminar.');
      return;
    }

    refresh();
  }

  return (
    <div className="d-flex align-items-center">
      <button
        className={`${styles.actionBtn} ${user.is_active ? styles.actionBtnWarning : styles.actionBtnSuccess}`}
        onClick={toggleActive}
        title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
        disabled={!!user.deleted_at}
      >
        <i className={`bi ${user.is_active ? 'bi-person-down' : 'bi-person-up'}`}></i>
      </button>

      <button
        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
        onClick={softDelete}
        title="Eliminar usuario"
        disabled={!!user.deleted_at}
      >
        <i className="bi bi-trash3"></i>
      </button>
    </div>
  );
}