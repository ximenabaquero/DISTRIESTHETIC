interface Props {
  telefono: string;
  email: string;
}

const items = [
  {
    label: "Ubicación",
    value: "Bogotá, Colombia",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Horario",
    value: "Lun–Vie: 6:00 AM – 9:00 PM · Sáb: 8:00 AM – 8:00 PM",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ContactInfoCard({ telefono, email }: Props) {
  return (
    <div className="bg-[#111c30] rounded-xl border p-6 space-y-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <h3 className="font-bold text-[#f0f4ff]">Información de contacto</h3>

      {/* Teléfono */}
      <a
        href={`tel:${telefono.replace(/\s/g, "")}`}
        className="flex items-center gap-3 group"
      >
        <span className="w-8 h-8 rounded-lg bg-[#1a6cf6]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a6cf6]/25 transition-colors">
          <svg className="w-4 h-4 text-[#1a6cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </span>
        <div>
          <p className="text-xs text-[#8899bb]">Teléfono</p>
          <p className="text-sm font-medium text-[#f0f4ff] group-hover:text-[#1a6cf6] transition-colors">{telefono}</p>
        </div>
      </a>

      {/* Email */}
      <a href={`mailto:${email}`} className="flex items-center gap-3 group">
        <span className="w-8 h-8 rounded-lg bg-[#00c8a0]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00c8a0]/25 transition-colors">
          <svg className="w-4 h-4 text-[#00c8a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </span>
        <div>
          <p className="text-xs text-[#8899bb]">Email</p>
          <p className="text-sm font-medium text-[#f0f4ff] group-hover:text-[#00c8a0] transition-colors">{email}</p>
        </div>
      </a>

      {/* Ubicación y horario */}
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-[#1a6cf6]/15 flex items-center justify-center flex-shrink-0 text-[#1a6cf6] mt-0.5">
            {item.icon}
          </span>
          <div>
            <p className="text-xs text-[#8899bb]">{item.label}</p>
            <p className="text-sm font-medium text-[#f0f4ff]">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
