'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

/* =====================================================
   TYPES
===================================================== */

type ToastType = "success" | "error";

interface Toast {
  message: string;
  type: ToastType;
}

interface Props {
  mode: "create" | "edit";
  serviceId?: string;
  initialData?: any;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function ServiceForm({
  mode,
  serviceId,
  initialData,
}: Props) {

  /* ================= STATE ================= */

  const supabase = createSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<Toast | null>(null);

  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url ?? null
  );

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price?.toString() ?? "",
    visibility: initialData?.visibility ?? "public",
    is_active: initialData?.is_active ?? true,
    category_id: initialData?.category_id ?? "",
    image_url: initialData?.image_url ?? "",
  });

  /* ================= TOAST HELPER ================= */

  function showToast(message: string, type: ToastType = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .then(({ data }) => data && setCategories(data));
  }, []);

  /* ================= IMAGE ================= */

  function handleImage(file?: File) {
    if (!file) return;

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return form.image_url || null;

    if (!imageFile.type.startsWith("image/")) {
      showToast("El archivo no es una imagen válida", "error");
      return null;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      showToast("La imagen no debe superar los 5MB", "error");
      return null;
    }

    const ext = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `services/${fileName}`;

    const { error } = await supabase.storage
      .from("services-images")
      .upload(filePath, imageFile);

    if (error) {
      showToast("Error al subir la imagen", "error");
      return null;
    }

    return supabase.storage
      .from("services-images")
      .getPublicUrl(filePath).data.publicUrl;
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim())
      return showToast("El nombre del servicio es obligatorio", "error");

    if (!form.category_id)
      return showToast("Selecciona una categoría", "error");

    if (Number(form.price) <= 0)
      return showToast("El precio debe ser mayor a 0", "error");

    setLoading(true);

    const imageUrl = await uploadImage();
    if (imageFile && !imageUrl) {
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      visibility: form.visibility,
      is_active: form.is_active,
      category_id: form.category_id,
      image_url: imageUrl,
    };

    const { error } =
      mode === "create"
        ? await supabase.from("services").insert(payload)
        : await supabase
            .from("services")
            .update(payload)
            .eq("id", serviceId);

    setLoading(false);

    if (error) {
      showToast("Ocurrió un error al guardar", "error");
    } else {
      showToast(
        mode === "create"
            ? "Servicio creado correctamente"
            : "Cambios guardados correctamente",
        "success"
        );

        setImageFile(null);

        /* regresar después de mostrar el toast */
        setTimeout(() => {
        router.back();
        }, 1200);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="admin-root admin-form-bg">

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 30,
            right: 30,
            zIndex: 9999,
            padding: "14px 22px",
            borderRadius: 14,
            fontWeight: 500,
            background:
              toast.type === "success"
                ? "rgba(30,160,90,0.95)"
                : "rgba(200,60,60,0.95)",
            color: "#fff",
            boxShadow: "0 12px 40px rgba(0,0,0,.25)",
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="container py-5 d-flex justify-content-center">
        <div className="admin-form-panel">

          <header className="admin-form-header">

            {/* BACK BUTTON */}
            <button
              type="button"
              className="admin-back-btn"
              onClick={() => router.back()}
            >
              ← Volver
            </button><br /><br />

            <h1 className="admin-form-title">
              {mode === "create" ? "Crear servicio" : "Editar servicio"}
            </h1>

            <p className="admin-form-subtitle">
              Información visible en el sitio web.
            </p>

          </header>

          <form onSubmit={handleSubmit} className="admin-form-grid">

            <div className="form-grid">
            {/* LEFT SIDE */}
            <div className="form-stack">
            <div className="form-left">
              <section>
                <label className="admin-label">Nombre del servicio</label>
                <input
                  className="admin-input admin-input-lg"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Ej. Masaje relajante premium"
                />
              </section><br></br>

              <section>
                <label className="admin-label">Descripción</label>
                <textarea
                  rows={4}
                  className="admin-input"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe el tratamiento, beneficios y duración"
                />
              </section>
            </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="form-right">
              <section>
                <label className="admin-label">Imagen del servicio</label>
                <div
                  className="admin-image-drop"
                  onClick={() =>
                    document.getElementById("imageInput")?.click()
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImage(e.dataTransfer.files[0]);
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="admin-image-preview"
                    />
                  ) : (
                    <div className="admin-image-placeholder">
                      <strong>Arrastra una imagen aquí</strong>
                      <span>o haz clic para seleccionar</span>
                    </div>
                  )}

                  <input
                    id="imageInput"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleImage(e.target.files[0])
                    }
                  />
                </div>
              </section>
            </div>
          </div>

            {/* PRICE */}
            <section className="admin-col-6">
              <label className="admin-label">Precio</label>
              <input
                type="number"
                className="admin-input"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                placeholder="0.00"
              />
            </section>

            {/* CATEGORY */}
            <section className="admin-col-6">
              <label className="admin-label">Categoría</label>
              <select
                className="admin-input"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Seleccionar</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </section>

            {/* ACTIVE */}
            <section className="admin-switch">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_active: e.target.checked,
                  })
                }
              />
              <span>Servicio activo</span>
            </section>

            {/* SUBMIT */}
            <footer className="admin-form-footer">
              <button
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Guardando…"
                  : mode === "create"
                  ? "Crear servicio"
                  : "Guardar cambios"}
              </button>
            </footer>

          </form>
        </div>
      </div>
    </div>
  );
}
