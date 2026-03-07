import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente admin (omite RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 🔐 Obtener token del header
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Cliente normal con token del usuario
    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // 1️⃣ Verificar usuario autenticado
    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2️⃣ Verificar que sea admin activo
    const { data: profile } = await supabaseUser
      .from('profiles')
      .select('role, is_active, deleted_at')
      .eq('id', user.id)
      .single();

    if (
      !profile ||
      profile.role !== 'admin' ||
      !profile.is_active ||
      profile.deleted_at
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // 3️⃣ Obtener datos enviados
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // 4️⃣ Crear usuario en Auth
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    const userId = userData.user.id;

    // 5️⃣ Actualizar profile a admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'admin',
        display_name: displayName ?? email.split('@')[0],
        is_active: true,
      })
      .eq('id', userId);

    if (profileError) {
      return NextResponse.json(
        { error: 'Usuario creado pero falló actualización de perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Administrador creado correctamente',
    });
  } catch (err) {
    console.error('ERROR CREATE USER:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}