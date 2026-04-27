'use client'

import Image from 'next/image'

type Service = {
  id: string
  title: string
  description: string | null
  price: number | null
  visibility: 'public' | 'private'
  image_url: string | null
}

type ServiceCardProps = {
  service: Service
  onSelect: (service: Service) => void
}

const ArrowIcon = () => (
  <svg className="service-card-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const isPrivate = service.visibility === 'private'

  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className="service-card group"
      aria-label={`Ver detalles de ${service.title}`}
    >
      {/* Imagen */}
      <div className="service-card-image-wrapper">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            sizes="(max-width: 600px) 100vw,
                   (max-width: 992px) 50vw,
                   25vw"
            className="service-card-image"
            priority={false}
          />
        ) : (
          <div className="service-card-image-placeholder" />
        )}

        <div className="service-card-overlay" />

        {isPrivate && (
          <span className="service-card-badge">
            Privado
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="service-card-content">
        <h3 className="service-card-title">
          {service.title}
        </h3>

        {service.description && (
          <p className="service-card-description">
            {service.description}
          </p>
        )}

        <div className="service-card-footer">
          <div className="service-card-price">
            {service.price !== null
              ? `$${service.price.toLocaleString()}`
              : 'Consulta previa'}
          </div>
          <ArrowIcon />
        </div>
      </div>
    </button>
  )
}

