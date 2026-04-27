'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import UsersTable from '@/components/admin/users/UsersTable';
import styles from '@/components/admin/users/AdminUsers.module.css';

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

  const fetchUsers = useCallback(async () => {
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

    setUsers(data as Profile[] || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="container py-4 luxuryFade" style={{ animation: 'luxuryFade 0.6s ease forwards' }}>
      <div className={styles.pageHeader}>
        <h1 className="m-0 fs-3">Gestión de Administradores</h1>
      </div>

      <div className={styles.premiumCard}>
        <UsersTable
          users={users}
          loading={loading}
          refresh={fetchUsers}
        />
      </div>
    </div>
  );
}