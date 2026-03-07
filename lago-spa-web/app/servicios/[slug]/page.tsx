import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import ServicesGrid from './ServicesGrid'

import '@/styles/servicios-layout.css'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ServicesByCategoryPage({ params }: PageProps) {
  const { slug } = await params

  const supabase = await createSupabaseServerClient()

  

  // 1️⃣ Obtener categoría
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // 2️⃣ Obtener servicios
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: true })

  if (servicesError) {
    throw new Error('Error cargando servicios')
  }

  return (
    <section className="services-page">
      <div className="services-container">

        <header className="services-header">
          <h1 className="services-title">{category.name}</h1>

          {category.description && (
            <p className="services-description">
              {category.description}
            </p>
          )}
        </header>

        {services.length === 0 ? (
          <p className="services-empty">
            No hay servicios disponibles en esta categoría.
          </p>
        ) : (
          <ServicesGrid services={services} />
        )}

      </div>
    </section>
  )
}
