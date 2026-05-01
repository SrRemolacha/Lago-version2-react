import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

import '../styles/admin-theme.css'
import '../styles/admin-forms.css'
import '../styles/admin-services.css'
import '../styles/admin-dashboard.css'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  // Verificar sesión en el servidor
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar que sea admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, deleted_at')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'admin') {
    redirect('/login')
  }

  if (profile.is_active === false || profile.deleted_at) {
    redirect('/login')
  }

  return <>{children}</>
}