'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace('/admin');
  }

  return (
    <div className="login-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card login-animate p-4 w-100" style={{ maxWidth: 400 }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <div className="login-logo">
            LAGO
            <span>Spa ⋅ Estetica ⋅ Salud</span>
          </div>
          <div className="login-accent"></div>
          <p className="login-subtitle">
            Acceso exclusivo para personal autorizado
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="d-grid gap-3">
          
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

          <button type="submit" className="btn-login btn-gold-accent text-white mt-2" disabled={loading}>
            {loading ? 'Verificando…' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Sesión segura */}
        <div className="secure-session">
          🔒 Sesión protegida mediante cifrado seguro
        </div>

        {/* Error */}
        {error && (
          <div className="toast show toast-clinic mt-3">
            <div className="toast-body">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
