'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // 🔐 Obtener sesión actual
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      setError('No hay sesión activa.');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 🔥 enviamos token
      },
      body: JSON.stringify({
        email,
        password,
        displayName: email.split('@')[0],
      }),
    });

    const result = await response.json();
    console.log('CREATE USER RESPONSE:', result);
    setLoading(false);

    if (!response.ok) {
      setError(result.error || 'Error al crear usuario');
      return;
    }

    setSuccess('Administrador creado correctamente.');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="login-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card login-animate p-4 w-100" style={{ maxWidth: 420 }}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="login-logo">
            LAGO
            <span>Spa · Estética · Salud</span>
          </div>
          <div className="login-accent"></div>
          <p className="login-subtitle">
            Registro de personal administrativo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="d-grid gap-3">

          <div className="field-group">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label>Correo electrónico</label>
          </div>

          <div className="field-group">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Contraseña</label>
          </div>

          <div className="field-group">
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Confirmar contraseña</label>
          </div>

          <button
            type="submit"
            className="btn-login btn-gold-accent mt-2"
            disabled={loading}
          >
            {loading ? 'Creando usuario…' : 'Registrar administrador'}
          </button>
        </form>

        {/* Success */}
        {success && (
          <div className="toast show toast-clinic mt-3">
            <div className="toast-body">
              {success}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="toast show toast-clinic mt-3">
            <div className="toast-body">
              {error}
            </div>
          </div>
        )}

        <div className="secure-session">
          🔒 Registro seguro para uso interno
        </div>

      </div>
    </div>
  );
}
