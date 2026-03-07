'use client'

import { useEffect } from 'react'
import Image from 'next/image'

type Service = {
  id: string
  title: string
  description: string | null
  price: number | null
  visibility: 'public' | 'private'
  image_url: string | null
}

type ServiceModalProps = {
  service: Service | null
  onClose: () => void
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [service])

  if (!service) return null

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div
        className="service-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="service-modal-close"
          onClick={onClose}
        >
          ×
        </button>

        {service.image_url && (
          <div className="service-modal-image-wrapper">
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="service-modal-image"
            />
          </div>
        )}

        <div className="service-modal-content">
          <h2 className="service-modal-title">
            {service.title}
          </h2>

          {service.description && (
            <p className="service-modal-description">
              {service.description}
            </p>
          )}

          <div className="service-modal-price">
            {service.price !== null
              ? `$${service.price.toLocaleString()}`
              : 'Consulta previa'}
          </div>

          <button className="service-modal-cta">
            Reservar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
