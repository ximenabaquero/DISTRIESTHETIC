export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  disponible: boolean;
  etiqueta: string;
  precio: number | null;
  stock: number;
  imagenUrl: string | null;
}

export const productosBase: Producto[] = [
  // ── Medicamentos ──────────────────────────────────────────────
  { id: 1,  nombre: "Lidocaína 50 ml",                      descripcion: "unidad $8.500 | caja x20 $160.000",       categoria: "medicamentos", disponible: true, etiqueta: "NUEVO",      precio: 8500,   stock: 0, imagenUrl: null },
  { id: 3,  nombre: "Adrenalina",                            descripcion: "ampolla",                                  categoria: "medicamentos", disponible: true, etiqueta: "DISPONIBLE", precio: 1800,   stock: 0, imagenUrl: null },
  { id: 4,  nombre: "Bicarbonato",                           descripcion: "ampolla",                                  categoria: "medicamentos", disponible: true, etiqueta: "STOCK",      precio: 3800,   stock: 0, imagenUrl: null },
  { id: 5,  nombre: "Clindamicina 600 mg",                   descripcion: "ampolla",                                  categoria: "medicamentos", disponible: true, etiqueta: "600mg",      precio: 4500,   stock: 0, imagenUrl: null },
  { id: 6,  nombre: "Gentamicina 80 mg",                     descripcion: "ampolla",                                  categoria: "medicamentos", disponible: true, etiqueta: "80mg",       precio: 2500,   stock: 0, imagenUrl: null },
  { id: 38, nombre: "Gentamicina 160 mg",                    descripcion: "ampolla",                                  categoria: "medicamentos", disponible: true, etiqueta: "160mg",      precio: 3200,   stock: 0, imagenUrl: null },
  { id: 7,  nombre: "Enoxaparina sódica 40 mg",              descripcion: "40 mg",                                    categoria: "medicamentos", disponible: true, etiqueta: "40mg",       precio: 11500,  stock: 0, imagenUrl: null },
  { id: 8,  nombre: "Cefalexina 500 mg",                     descripcion: "sobre x10",                               categoria: "medicamentos", disponible: true, etiqueta: "x10",        precio: 7000,   stock: 0, imagenUrl: null },
  { id: 9,  nombre: "Propofol 20 ml",                        descripcion: "20 ml",                                    categoria: "medicamentos", disponible: true, etiqueta: "20ml",       precio: 7500,   stock: 0, imagenUrl: null },
  { id: 10, nombre: "Tramadol clorhidrato 50 mg/ml",         descripcion: "50 mg/ml",                                 categoria: "medicamentos", disponible: true, etiqueta: "50mg",       precio: 3000,   stock: 0, imagenUrl: null },
  { id: 11, nombre: "Dexametazona 8 mg/2 ml",               descripcion: "caja x100",                               categoria: "medicamentos", disponible: true, etiqueta: "x100",       precio: 180000, stock: 0, imagenUrl: null },
  { id: 39, nombre: "Ondansetron 8 mg 4 ml",                 descripcion: "ampolla",                                  categoria: "medicamentos", disponible: true, etiqueta: "8mg",        precio: 4500,   stock: 0, imagenUrl: null },
  { id: 12, nombre: "Diclofenaco 75 mg",                     descripcion: "caja x100",                               categoria: "medicamentos", disponible: true, etiqueta: "x100",       precio: 200000, stock: 0, imagenUrl: null },
  { id: 40, nombre: "Acetaminofén 325 mg + codeína 30 mg",   descripcion: "sobre x10",                               categoria: "medicamentos", disponible: true, etiqueta: "COMBO",      precio: 9000,   stock: 0, imagenUrl: null },
  { id: 41, nombre: "Meloxicam 15 mg",                       descripcion: "sobre x10 tabletas",                      categoria: "medicamentos", disponible: true, etiqueta: "15mg",       precio: 7200,   stock: 0, imagenUrl: null },

  // ── Soluciones y líquidos ─────────────────────────────────────
  { id: 13, nombre: "Frasco 2.5 L",                          descripcion: "sin tapa $220.000 | con tapa $290.000",   categoria: "soluciones",   disponible: true, etiqueta: "2.5L",       precio: 220000, stock: 0, imagenUrl: null },
  { id: 14, nombre: "Solución salina 500 ml",                descripcion: "500 ml",                                   categoria: "soluciones",   disponible: true, etiqueta: "500ml",      precio: 4500,   stock: 0, imagenUrl: null },
  { id: 15, nombre: "Solución salina 1.000 ml",              descripcion: "1.000 ml",                                 categoria: "soluciones",   disponible: true, etiqueta: "1L",         precio: 6500,   stock: 0, imagenUrl: null },
  { id: 16, nombre: "Lactato de Ringer 500 ml",              descripcion: "500 ml",                                   categoria: "soluciones",   disponible: true, etiqueta: "500ml",      precio: 3800,   stock: 0, imagenUrl: null },

  // ── Insumos médicos ───────────────────────────────────────────
  { id: 42, nombre: "Manguera de succión 0.65 cm x 3 m",    descripcion: "estéril",                                  categoria: "insumos",      disponible: true, etiqueta: "ESTÉRIL",    precio: 9000,   stock: 0, imagenUrl: null },
  { id: 43, nombre: "Compresa estéril Vitalmedic 45x45",     descripcion: "paquete x5",                              categoria: "insumos",      disponible: true, etiqueta: "x5",         precio: 9000,   stock: 0, imagenUrl: null },
  { id: 44, nombre: "Gasa estéril 7.5 x 7.5",               descripcion: "caja x20 unidades",                        categoria: "insumos",      disponible: true, etiqueta: "x20",        precio: 56000,  stock: 0, imagenUrl: null },
  { id: 45, nombre: "Micropore 2\" 3M",                      descripcion: "caja x6 unidades",                         categoria: "insumos",      disponible: true, etiqueta: "x6",         precio: 50000,  stock: 0, imagenUrl: null },
  { id: 2,  nombre: "Wypall Yumbo",                          descripcion: "890 paños",                                categoria: "insumos",      disponible: true, etiqueta: "STOCK",      precio: 190000, stock: 0, imagenUrl: null },
  { id: 17, nombre: "Microbrush",                            descripcion: "x100 unidades",                           categoria: "insumos",      disponible: true, etiqueta: "x100",       precio: 14000,  stock: 0, imagenUrl: null },
  { id: 46, nombre: "Guardian 2.9 L",                        descripcion: "2.9 litros",                               categoria: "insumos",      disponible: true, etiqueta: "2.9L",       precio: 7000,   stock: 0, imagenUrl: null },
  { id: 47, nombre: "Guardian 1.5 L",                        descripcion: "1.5 litros",                               categoria: "insumos",      disponible: true, etiqueta: "1.5L",       precio: 6000,   stock: 0, imagenUrl: null },
  { id: 18, nombre: "Jeringas 3 ml",                         descripcion: "caja x100",                               categoria: "insumos",      disponible: true, etiqueta: "3ml",        precio: 27000,  stock: 0, imagenUrl: null },
  { id: 19, nombre: "Jeringas 5 ml",                         descripcion: "caja x100",                               categoria: "insumos",      disponible: true, etiqueta: "5ml",        precio: 28000,  stock: 0, imagenUrl: null },
  { id: 20, nombre: "Jeringas 10 ml",                        descripcion: "caja x100",                               categoria: "insumos",      disponible: true, etiqueta: "10ml",       precio: 30000,  stock: 0, imagenUrl: null },
  { id: 21, nombre: "Jeringas 20 ml",                        descripcion: "caja x50",                                categoria: "insumos",      disponible: true, etiqueta: "20ml",       precio: 50000,  stock: 0, imagenUrl: null },
  { id: 22, nombre: "Agujas 30G x ½",                        descripcion: "caja completa",                           categoria: "insumos",      disponible: true, etiqueta: "30G",        precio: 25000,  stock: 0, imagenUrl: null },
  { id: 48, nombre: "Agujas 16G x ½",                        descripcion: "caja x100",                               categoria: "insumos",      disponible: true, etiqueta: "16G",        precio: 20000,  stock: 0, imagenUrl: null },
  { id: 49, nombre: "Cuchillas #11",                         descripcion: "caja x100 unidades",                      categoria: "insumos",      disponible: true, etiqueta: "#11",        precio: 55000,  stock: 0, imagenUrl: null },
  { id: 50, nombre: "Cuchillas #15",                         descripcion: "caja x100 unidades",                      categoria: "insumos",      disponible: true, etiqueta: "#15",        precio: 55000,  stock: 0, imagenUrl: null },
  { id: 23, nombre: "Yelcos #22",                            descripcion: "caja x50",                                categoria: "insumos",      disponible: true, etiqueta: "#22",        precio: 150000, stock: 0, imagenUrl: null },
  { id: 24, nombre: "Tubos para plasma",                     descripcion: "100 unid., tapa azul",                    categoria: "insumos",      disponible: true, etiqueta: "x100",       precio: 56000,  stock: 0, imagenUrl: null },
  { id: 54, nombre: "Equipo de macrogoteo",                  descripcion: "unidad",                                   categoria: "insumos",      disponible: true, etiqueta: "UNIDAD",     precio: 1900,   stock: 0, imagenUrl: null },
  { id: 55, nombre: "Filtro antibacterial succionador",      descripcion: "paquete x2 unidades",                     categoria: "insumos",      disponible: true, etiqueta: "x2",         precio: 50000,  stock: 0, imagenUrl: null },
  { id: 51, nombre: "Llave de 3 vías Ghc Care",              descripcion: "unidad",                                   categoria: "insumos",      disponible: true, etiqueta: "UNIDAD",     precio: 2100,   stock: 0, imagenUrl: null },
  { id: 52, nombre: "Aceite de almendras",                   descripcion: "galón 3.8 L",                             categoria: "insumos",      disponible: true, etiqueta: "3.8L",       precio: 70000,  stock: 0, imagenUrl: null },
  { id: 53, nombre: "Gel conductor",                         descripcion: "galón 3.8 L",                             categoria: "insumos",      disponible: true, etiqueta: "3.8L",       precio: 45000,  stock: 0, imagenUrl: null },

  // ── Desinfectantes y químicos ─────────────────────────────────
  { id: 25, nombre: "Glutamida",                             descripcion: "galón 4.000 ml",                          categoria: "quimicos",     disponible: true, etiqueta: "4L",         precio: 55000,  stock: 0, imagenUrl: null },
  { id: 26, nombre: "Benzaldina",                            descripcion: "galón 4.000 ml",                          categoria: "quimicos",     disponible: true, etiqueta: "4L",         precio: 65000,  stock: 0, imagenUrl: null },
  { id: 56, nombre: "Jabón quirúrgico",                      descripcion: "1.000 ml",                                categoria: "quimicos",     disponible: true, etiqueta: "1L",         precio: 56000,  stock: 0, imagenUrl: null },

  // ── Ropa e indumentaria médica ────────────────────────────────
  { id: 27, nombre: "Medias antiembólicas",                  descripcion: "todas las tallas, color blanco",          categoria: "ropa",         disponible: true, etiqueta: "PAR",        precio: 59000,  stock: 0, imagenUrl: null },
  { id: 57, nombre: "Medias de compresión media",            descripcion: "hasta abajo de la rodilla, tallas SM y LXL (par)", categoria: "ropa", disponible: true, etiqueta: "SM/LXL",   precio: 30000,  stock: 0, imagenUrl: null },
  { id: 58, nombre: "Mentonera",                             descripcion: "tallas S/M y L/XL",                       categoria: "ropa",         disponible: true, etiqueta: "S/M·L/XL",  precio: 52000,  stock: 0, imagenUrl: null },
  { id: 28, nombre: "Bata de cirujano manga larga",          descripcion: "manga larga",                              categoria: "ropa",         disponible: true, etiqueta: "CIRUJANO",   precio: 4500,   stock: 0, imagenUrl: null },
  { id: 29, nombre: "Bata de paciente manga sisa",           descripcion: "manga sisa",                               categoria: "ropa",         disponible: true, etiqueta: "PACIENTE",   precio: 4000,   stock: 0, imagenUrl: null },
  { id: 30, nombre: "Polainas",                              descripcion: "50 pares",                                 categoria: "ropa",         disponible: true, etiqueta: "x50",        precio: 25000,  stock: 0, imagenUrl: null },
  { id: 31, nombre: "Gorros tipo oruga",                     descripcion: "100 unidades",                             categoria: "ropa",         disponible: true, etiqueta: "x100",       precio: 20000,  stock: 0, imagenUrl: null },
  { id: 32, nombre: "Sábana desechable para camilla",        descripcion: "para camilla",                             categoria: "ropa",         disponible: true, etiqueta: "DESECHABLE", precio: 4500,   stock: 0, imagenUrl: null },
  { id: 59, nombre: "Kit panty + brassier",                  descripcion: "paquete x10",                             categoria: "ropa",         disponible: true, etiqueta: "x10",        precio: 35000,  stock: 0, imagenUrl: null },

  // ── Protección personal ───────────────────────────────────────
  { id: 33, nombre: "Tapabocas",                             descripcion: "x50, empaque individual",                 categoria: "proteccion",   disponible: true, etiqueta: "x50",        precio: 11500,  stock: 0, imagenUrl: null },
  { id: 34, nombre: "Guantes de nitrilo",                    descripcion: "caja x50 pares",                          categoria: "proteccion",   disponible: true, etiqueta: "NITRILO",    precio: 22000,  stock: 0, imagenUrl: null },
  { id: 35, nombre: "Guantes estériles",                     descripcion: "caja x50 pares",                          categoria: "proteccion",   disponible: true, etiqueta: "ESTÉRIL",    precio: 60000,  stock: 0, imagenUrl: null },
  { id: 36, nombre: "Guantes de látex",                      descripcion: "caja completa",                           categoria: "proteccion",   disponible: true, etiqueta: "LÁTEX",      precio: 20000,  stock: 0, imagenUrl: null },
  { id: 37, nombre: "Campo estéril 1x1",                     descripcion: "1x1 metro",                               categoria: "proteccion",   disponible: true, etiqueta: "1x1",        precio: 4000,   stock: 0, imagenUrl: null },
];

const obtenerSiguienteId = () =>
  productosBase.reduce((maxId, producto) => Math.max(maxId, producto.id), 0) + 1;

export const agregarProducto = (producto: Omit<Producto, "id">): Producto => {
  const nuevoProducto: Producto = { id: obtenerSiguienteId(), ...producto };
  productosBase.push(nuevoProducto);
  return nuevoProducto;
};