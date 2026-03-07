'use client';

import UserActions from './UserActions';

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
    return <p>Cargando administradores...</p>;
  }

  if (users.length === 0) {
    return <p>No hay administradores registrados.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Creado</th>
            <th style={{ width: 180 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.display_name ?? user.id}</td>
              <td>
                {user.deleted_at ? (
                  <span className="badge bg-danger">Eliminado</span>
                ) : user.is_active ? (
                  <span className="badge bg-success">Activo</span>
                ) : (
                  <span className="badge bg-secondary">Inactivo</span>
                )}
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
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