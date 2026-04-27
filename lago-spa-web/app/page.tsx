'use client';

import Link from 'next/link';

export default function HomePage() {
return (
<div className="home-hero">
{/* HERO */}
<section className="hero-section d-flex align-items-center justify-content-center text-center">
<div className="hero-overlay"></div>
<div className="container position-relative">
<h1 className="hero-logo">LAGO</h1>
<p className="hero-brand">Spa · Estética · Salud</p>
<h2 className="hero-title mt-4">
Donde el bienestar se convierte en una experiencia
</h2>
<p className="hero-subtitle mt-3">
Un espacio diseñado para el equilibrio, la calma y el cuidado integral del cuerpo.
</p>
</div>
</section>

{/* SERVICIOS */}
<section className="services-section container py-5">
  <div className="text-center mb-5">
    <h3 className="section-title">Nuestros servicios</h3>
    <p className="section-subtitle">
      Tratamientos especializados pensados para tu bienestar
    </p>
  </div>

  <div className="row g-4">
    <div className="col-12 col-md-6 col-lg-3">
      <Link href="/servicios/facial" className="main-card facial">
        <div className="main-card-overlay">
          <h3>Facial</h3>
        </div>
      </Link>
    </div>

    <div className="col-12 col-md-6 col-lg-3">
      <Link href="/servicios/corporal" className="main-card corporal">
        <div className="main-card-overlay">
          <h3>Corporal</h3>
        </div>
      </Link>
    </div>

    <div className="col-12 col-md-6 col-lg-3">
      <Link href="/servicios/salud" className="main-card salud">
        <div className="main-card-overlay">
          <h3>Salud</h3>
        </div>
      </Link>
    </div>

    <div className="col-12 col-md-6 col-lg-3">
      <Link href="/servicios/spa" className="main-card spa">
        <div className="main-card-overlay">
          <h3>Spa</h3>
        </div>
      </Link>
    </div>
  </div>
</section>

{/* HORARIOS */}
<section className="schedule-section text-center py-5">
<h3 className="section-title">Horarios de atención</h3>
<p className="section-subtitle mt-3">
Lunes a Sábado: 7:00 AM – 6:00 PM
</p>
<p className="section-subtitle">
Domingos: 8:00 AM – 12:00 PM
</p>
</section>
</div>
);
}


function ServiceCard({ title, href }: { title: string; href: string }) {
return (
<div className="col-12 col-md-6 col-lg-3">
<Link href={href} className="main-card d-flex align-items-end">
<div className="service-overlay"></div>
<h4 className="service-title">{title}</h4>
</Link>
</div>
);
}