'use client'

import { useState } from 'react'
import ServiceCard from '@/components/services/ServiceCard'
import ServiceModal from '@/components/services/serviceModal'

type Service = {
  id: string
  title: string
  description: string | null
  price: number | null
  visibility: 'public' | 'private'
  image_url: string | null
}

type ServicesGridProps = {
  services: Service[]
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={(s) => setSelectedService(s)}
          />
        ))}
      </div>

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </>
  )
}
