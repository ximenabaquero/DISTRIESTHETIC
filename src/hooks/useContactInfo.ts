"use client";

import { useState, useEffect } from "react";

export interface ContactInfo {
  telefono: string;
  whatsapp: string;
}

// Número de fallback mientras carga o si falla el fetch
export const DEFAULT_WHATSAPP = "573046831493";
export const DEFAULT_TELEFONO = "304 683 1493";

// Caché a nivel de módulo: un solo fetch por sesión del navegador
let cached: ContactInfo | null = null;
let pending: Promise<ContactInfo | null> | null = null;

function fetchContactInfo(): Promise<ContactInfo | null> {
  if (pending) return pending;
  pending = fetch("/api/contacto-info")
    .then((r) => r.json())
    .then((json) => {
      if (json.ok && json.contact) {
        cached = json.contact as ContactInfo;
        return cached;
      }
      return null;
    })
    .catch(() => null);
  return pending;
}

export function useContactInfo(): ContactInfo {
  const [info, setInfo] = useState<ContactInfo>(() =>
    cached ?? { telefono: DEFAULT_TELEFONO, whatsapp: DEFAULT_WHATSAPP },
  );

  useEffect(() => {
    if (cached) {
      setInfo(cached);
      return;
    }
    fetchContactInfo().then((data) => {
      if (data) setInfo(data);
    });
  }, []);

  return info;
}
