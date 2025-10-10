import fs from "fs/promises";
import path from "path";

export interface ContactInfo {
  telefono: string;
  whatsapp: string;
}

const filePath = path.join(process.cwd(), "data", "contactInfo.json");
const defaults: ContactInfo = {
  telefono: "304 683 1493",
  whatsapp: "573046831493",
};

async function readFile(): Promise<ContactInfo> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<ContactInfo>;
    return {
      telefono: parsed.telefono?.toString().trim() || defaults.telefono,
      whatsapp: parsed.whatsapp?.toString().trim() || defaults.whatsapp,
    };
  } catch {
    return defaults;
  }
}

export async function getContactInfo(): Promise<ContactInfo> {
  return readFile();
}

export async function updateContactInfo(info: ContactInfo): Promise<ContactInfo> {
  const sanitized = {
    telefono: info.telefono.trim(),
    whatsapp: info.whatsapp.trim(),
  };
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(sanitized, null, 2), "utf8");
  return sanitized;
}