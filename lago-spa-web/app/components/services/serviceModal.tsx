'use client'

import { useEffect, useState } from 'react'
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

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden'
      // Pequeño delay temporal para la animación de entrada
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [service])

  if (!service) return null

  // Link predeterminado de whatsapp (esto puede ser dinámico)
  const whatsappMsg = `Hola, quisiera más información sobre el servicio: ${service.title}`
  const whatsappUrl = `https://wa.me/573113118625?text=${encodeURIComponent(whatsappMsg)}`

  return (
    <div 
      className={`service-modal-overlay ${isVisible ? 'open' : ''}`} 
      onClick={onClose}
    >
      <div
        className="service-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="service-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <CloseIcon />
        </button>

        {service.image_url && (
          <div className="service-modal-image-wrapper">
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              className="service-modal-image"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <div className="service-modal-image-overlay" />
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

          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="service-modal-cta"
          >
            <WhatsAppIcon />
            Reservar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

