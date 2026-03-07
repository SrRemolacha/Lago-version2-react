export default function Footer() {
  return (
    <footer
      className="mt-auto border-top"
      style={{ backgroundColor: 'var(--bg-footer)' }}
    >
      <div className="container py-4">
        <div className="row text-center text-md-start">
          {/* Brand */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold" style={{ color: 'var(--brand-blue)' }}>
              Lago Spa & Clínica
            </h6>
            <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Bienestar, estética y salud con estándares profesionales.
            </p>
          </div>

          {/* Ubicación */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold">Ubicación</h6>
            <a
              href="https://maps.app.goo.gl/yyTeGQUrYzYhMMTQA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-gold-underline d-inline-block"
              style={{ color: 'var(--brand-blue)', fontSize: '0.9rem' }}
            >
              <i className="bi bi-geo-alt me-2"></i>
              Cra. 14 #11-88, Sogamoso, Boyacá
            </a>
          </div>

          {/* Redes */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-semibold">Redes Sociales</h6>
              <a
                href="https://www.facebook.com/profile.php?id=61577780604356"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-gold-underline d-inline-block"
                style={{ color: 'var(--brand-blue)', fontSize: '0.9rem' }}
              >
                <i className="bi bi-facebook me-2"></i>
                Facebook 
              </a><br />
              <a
                href="https://www.instagram.com/lagospaesteticasalud"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-gold-underline d-inline-block"
                style={{ color: 'var(--brand-blue)', fontSize: '0.9rem' }}
              >
                <i className="bi bi-instagram me-2"></i>
                Instagram 
              </a><br />
            </div>

          {/* Contacto */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold">Contacto</h6>
            <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <i className="bi bi-telephone me-2"></i> +57 311 311 8625<br />
              <i className="bi bi-telephone me-2"></i> +57 314 341 1955<br />
              <i className="bi bi-telephone me-2"></i> +57 313 510 5205<br />
              info@lagospa.com
            </p>
          </div>
        </div>

        <div
          className="text-center pt-3 mt-3"
          style={{
            borderTop: '1px solid var(--border-soft)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          © {new Date().getFullYear()} Lago Spa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
