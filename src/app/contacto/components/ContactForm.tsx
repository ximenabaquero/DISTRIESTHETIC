"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contacto/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No se pudo enviar el mensaje.");
      setStatus("success");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(0,200,160,0.12)" }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#00c8a0" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-1" style={{ color: "#00a882" }}>¡Mensaje enviado!</h3>
        <p className="text-sm mb-1" style={{ color: "#00a882" }}>Te contactamos pronto — antes de 2 horas.</p>
        <button onClick={() => setStatus("idle")} className="text-sm text-blue-600 hover:underline mt-4">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111c30] rounded-xl border p-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <h2 className="text-xl font-bold mb-6 text-[#f0f4ff]">Envíanos un mensaje</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-[#f0f4ff] mb-1.5">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-[#f0f4ff] bg-[#0b1221] placeholder:text-[#8899bb] focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              placeholder="Tu nombre completo"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#f0f4ff] mb-1.5">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm text-[#f0f4ff] bg-[#0b1221] placeholder:text-[#8899bb] focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-[#f0f4ff] mb-1.5">
            Teléfono <span className="text-[#8899bb] font-normal">(opcional)</span>
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm text-[#f0f4ff] bg-[#0b1221] placeholder:text-[#8899bb] focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            placeholder="+57 300 000 0000"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-[#f0f4ff] mb-1.5">
            Mensaje *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={5}
            value={formData.mensaje}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm text-[#f0f4ff] bg-[#0b1221] placeholder:text-[#8899bb] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            placeholder="Cuéntanos en qué podemos ayudarte..."
          />
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-lg px-4 py-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 text-white py-2.5 px-8 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {status === "loading" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar mensaje"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
