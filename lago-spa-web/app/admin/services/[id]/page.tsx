'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import ServiceForm from "@/admin/service-form";

// Interfaz exacta de la tabla "services"
interface Service {
  id: string;                          // uuid, NOT NULL
  title: string;                       // text, NOT NULL
  description?: string;                // text, NULL
  price: number;                       // numeric, NOT NULL
  image_url?: string;                  // text, NULL
  is_active?: boolean;                 // boolean, NULL
  created_by?: string;                 // uuid, NULL
  created_at?: string;                 // timestamp with time zone, NULL
  visibility?: "public" | "private";   // enum restringido
  category_id?: string;                // uuid, NULL
  details?: Record<string, any>;       // jsonb, NULL
}

export default function EditServicePage() {
  const supabase = createSupabaseBrowserClient();
  const { id } = useParams();

  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching service:", error);
        return;
      }

      // 👇 Cast explícito al tipo Service
      setService(data as Service);
    };

    fetchService();
  }, [id, supabase]);

  if (!service) return <div className="p-5">Cargando…</div>;

  return (
    <ServiceForm
      mode="edit"
      serviceId={id as string}
      initialData={service}
    />
  );
}
