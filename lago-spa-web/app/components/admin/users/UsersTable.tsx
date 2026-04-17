'use client';

import UserActions from './UserActions';
import styles from './AdminUsers.module.css';

type Profile = {
  id: string;
  role: string;
  display_name: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
};

export default function UsersTable({
  users,
  loading,
  refresh,
}: {
  users: Profile[];
  loading: boolean;
  refresh: () => void;
}) {
  if (loading) {
    return (
      <div className={styles.statusContainer}>
        <i className={`bi bi-arrow-repeat ${styles.spinner}`}></i>
        <div className={styles.statusText}>Cargando administradores...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={styles.statusContainer}>
        <i className="bi bi-person-slash"></i>
        <div className={styles.statusText}>No hay administradores registrados.</div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className={`${styles.tablePremium}`}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Creado</th>
            <th style={{ width: 140 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="fw-medium">{user.display_name ?? user.id}</td>
              <td>
                {user.deleted_at ? (
                  <span className={`${styles.glassBadge} ${styles.badgeDanger}`}>
                    <i className="bi bi-person-x-fill me-1"></i> Eliminado
                  </span>
                ) : user.is_active ? (
                  <span className={`${styles.glassBadge} ${styles.badgeSuccess}`}>
                    <i className="bi bi-person-check-fill me-1"></i> Activo
                  </span>
                ) : (
                  <span className={`${styles.glassBadge} ${styles.badgeSecondary}`}>
                    <i className="bi bi-person-dash-fill me-1"></i> Inactivo
                  </span>
                )}
              </td>
              <td className="text-main" style={{ fontSize: '0.9rem' }}>
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td>
                <UserActions user={user} refresh={refresh} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}