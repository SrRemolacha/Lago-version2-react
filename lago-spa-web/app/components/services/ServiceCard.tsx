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

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const isPrivate = service.visibility === 'private'

  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className="service-card"
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

        <div className="service-card-price">
          {service.price !== null
            ? `$${service.price.toLocaleString()}`
            : 'Consulta previa'}
        </div>
      </div>
    </button>
  )
}
