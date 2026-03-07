'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import ServiceForm from "@/admin/service-form";

export default function EditServicePage() {

  const supabase = createSupabaseBrowserClient();

  const { id } = useParams();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setService(data));
  }, [id]);

  if (!service) return <div className="p-5">Cargando…</div>;

  return (
    <ServiceForm
      mode="edit"
      serviceId={id as string}
      initialData={service}
    />
  );
}
