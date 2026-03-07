'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import UsersTable from '@/components/admin/users/UsersTable';

type Profile = {
  id: string;
  role: string;
  display_name: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
};

export default function AdminUsersPage() {
  const supabase = createSupabaseBrowserClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Gestión de Administradores</h1>

      <UsersTable
        users={users}
        loading={loading}
        refresh={fetchUsers}
      />
    </div>
  );
}