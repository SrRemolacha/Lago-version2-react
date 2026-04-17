'use client';

import { useState } from 'react';
import '../styles/contact.css';

// --- Premium SVG Icons ---
const IconLocation = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconSocial = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.53-4H14V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario listo para integrar con backend:', form);
    // You could also add a toast or success feedback here
  };

  return (
    <main className="contact-page">
      {/* HERO SECTION */}
      <section className="contact-hero">
        <h1 className="contact-hero-title">Contáctanos</h1>
        <p className="contact-hero-subtitle">
          Estamos aquí para brindarte una experiencia de bienestar, estética y salud con estándares profesionales.
          Déjanos tu mensaje y nuestro equipo te responderá en el menor tiempo posible.
        </p>
      </section>

      {/* CONTENT DIVIDED CONTAINER */}
      <section className="contact-container">
        
        {/* FORM CARD */}
        <div className="contact-card">
          <h2 className="contact-card-title">Envíanos un mensaje</h2>
          <p className="contact-card-desc">
            Completa el formulario y uno de nuestros especialistas se pondrá en contacto contigo muy pronto.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <input
                name="name"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                className="contact-input"
                required
              />
            </div>

            <div className="contact-form-group">
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                className="contact-input"
                required
              />
            </div>

            <div className="contact-form-group">
              <textarea
                name="message"
                placeholder="Escribe tu mensaje..."
                value={form.message}
                onChange={handleChange}
                className="contact-input contact-textarea"
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              Enviar mensaje
            </button>
          </form>
        </div>

        {/* INFO CARD */}
        <div className="contact-card">
          <h2 className="contact-card-title">Información de contacto</h2>
          <p className="contact-card-desc">
            Estaremos encantados de recibirte. Puedes visitarnos, llamarnos o escribirnos por nuestras redes.
          </p>

          <div className="contact-info-list">
            
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <IconLocation />
              </div>
              <div className="contact-info-content">
                <h4>Ubicación</h4>
                <p>Cra. 14 #11-88<br />Sogamoso, Boyacá</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <IconPhone />
              </div>
              <div className="contact-info-content">
                <h4>Teléfonos</h4>
                <p>
                  <a href="tel:+573113118625">+57 311 311 8625</a><br />
                  <a href="tel:+573143411955">+57 314 341 1955</a><br />
                  <a href="tel:+573135105205">+57 313 510 5205</a>
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <IconMail />
              </div>
              <div className="contact-info-content">
                <h4>Correo Electrónico</h4>
                <p><a href="mailto:info@lagospa.com">info@lagospa.com</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <IconSocial />
              </div>
              <div className="contact-info-content">
                <h4>Redes Sociales</h4>
                <p>
                  <a href="https://www.facebook.com/profile.php?id=61577780604356" target="_blank" rel="noopener noreferrer">Facebook</a> / <a href="https://www.instagram.com/lagospaesteticasalud" target="_blank" rel="noopener noreferrer">Instagram</a>
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* MAP SECTION */}
      <section className="contact-map-wrapper">
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps?q=Cra.%2014%20%2311-88%2C%20Sogamoso%2C%20Boyac%C3%A1&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de LAGO SPA en Sogamoso"
          />
        </div>
      </section>
    </main>
  );
}
