'use client';

import { useState } from "react";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {

  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="site-header border-bottom">
      <nav className="navbar navbar-expand-lg container py-3">

        {/* Brand */}
        <Link href="/" className="navbar-brand fw-semibold">
          <img
            src="https://ppmwqapanrsxnfpfuqol.supabase.co/storage/v1/object/public/assets/logos/encabezado.png"
            alt="Lago Spa & Clínica"
            className="logo-header"
          />
        </Link>

        {/* Toggle (Bootstrap collapse sigue funcionando) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

            {/* SERVICIOS DROPDOWN CONTROLADO */}
            <li
              className="nav-item position-relative"
              onMouseEnter={() => {
                if (window.innerWidth >= 992) setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 992) setDropdownOpen(false);
              }}
            >
              <button
                className="nav-link bg-transparent border-0" //me toco quitar la etiqueta de hover-gold-underline porque el subrayado quedaba debajo del dropdown, actualmente funciona pero puede que haya una mejor solución que si aplique el subrayado dorado
                onClick={() => {
                  if (window.innerWidth < 992) {
                    setDropdownOpen(prev => !prev);
                  }
                }}
                type="button"
              >
                Servicios
              </button>

              <ul className={`dropdown-menu premium-dropdown luxury-panel ${dropdownOpen ? 'show' : ''}`}>
                <li>
                  <Link href="/servicios/spa" className="dropdown-item luxury-item">
                    <span>Spa</span>
                    <small>Experiencias de relajación profunda</small>
                  </Link>
                </li>

                <li>
                  <Link href="/servicios/facial" className="dropdown-item luxury-item">
                    <span>Facial</span>
                    <small>Tratamientos avanzados para la piel</small>
                  </Link>
                </li>

                <li>
                  <Link href="/servicios/corporal" className="dropdown-item luxury-item">
                    <span>Corporal</span>
                    <small>Remodelación y bienestar integral</small>
                  </Link>
                </li>

                <li>
                  <Link href="/servicios/salud" className="dropdown-item luxury-item">
                    <span>Salud</span>
                    <small>Protocolos clínicos especializados</small>
                  </Link>
                </li>
              </ul>
            </li>

            {/* CONTACTO */}
            <li className="nav-item">
              <Link href="/#contacto" className="nav-link hover-gold-underline">
                Contacto
              </Link>
            </li>

            {/* ADMIN */}
            {profile?.role === 'admin' && (
              <li className="nav-item">
                <Link
                  href="/admin"
                  className="nav-link fw-semibold hover-gold-underline"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Admin
                </Link>
              </li>
            )}

            {/* AUTH */}
            <li className="nav-item mt-3 mt-lg-0">
              {user ? (
                <button
                  onClick={signOut}
                  className="btn btn-sm hover-gold-underline"
                  style={{
                    borderColor: 'var(--accent-gold)',
                    color: 'var(--accent-gold)',
                  }}
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: '#182a34',
                  }}
                >
                  Ingresar
                </Link>
              )}
            </li>

          </ul>
        </div>
      </nav>
    </header>
  );
}
