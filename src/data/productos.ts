export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  disponible: boolean;
  etiqueta: string;
  precio: number | null; // Precio en COP (sin impuestos adicionales) o null si no definido
  stock: number; // Cantidad disponible en inventario
  imagenUrl: string | null; // URL pública de la imagen del producto (opcional)
}

// Catálogo base (los precios y stock se pueden sobre-escribir desde el panel admin con localStorage)
export const productosBase: Producto[] = [
  // Medicamentos e insumos médicos
  { id: 1, nombre: "Lidocaína 50 ml", descripcion: "unidad | caja x20", categoria: "medicamentos", disponible: true, etiqueta: "NUEVO", precio: null, stock: 0, imagenUrl: null },
  { id: 2, nombre: "Wypall Yumbo", descripcion: "890 paños", categoria: "medicamentos", disponible: true, etiqueta: "STOCK", precio: null, stock: 0, imagenUrl: null },
  { id: 3, nombre: "Adrenalina", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "DISPONIBLE", precio: null, stock: 0, imagenUrl: null },
  { id: 4, nombre: "Bicarbonato", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "STOCK", precio: null, stock: 0, imagenUrl: null },
  { id: 5, nombre: "Clindamicina 600 mg", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "600mg", precio: null, stock: 0, imagenUrl: null },
  { id: 6, nombre: "Gentamicina 80 mg", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "80mg", precio: null, stock: 0, imagenUrl: null },
  { id: 7, nombre: "Enoxaparina sódica 40 mg", descripcion: "40 mg", categoria: "medicamentos", disponible: true, etiqueta: "40mg", precio: null, stock: 0, imagenUrl: null },
  { id: 8, nombre: "Cefalexina 500 mg", descripcion: "caja x10", categoria: "medicamentos", disponible: true, etiqueta: "x10", precio: null, stock: 0, imagenUrl: null },
  { id: 9, nombre: "Propofol 20 ml", descripcion: "20 ml", categoria: "medicamentos", disponible: true, etiqueta: "20ml", precio: null, stock: 0, imagenUrl: null },
  { id: 10, nombre: "Tramadol clorhidrato 50 mg/ml", descripcion: "50 mg/ml", categoria: "medicamentos", disponible: true, etiqueta: "50mg", precio: null, stock: 0, imagenUrl: null },
  { id: 11, nombre: "Dexametazona 8 mg/2 ml", descripcion: "caja x100", categoria: "medicamentos", disponible: true, etiqueta: "x100", precio: null, stock: 0, imagenUrl: null },
  { id: 12, nombre: "Diclofenaco 75 mg", descripcion: "caja x100", categoria: "medicamentos", disponible: true, etiqueta: "x100", precio: null, stock: 0, imagenUrl: null },

  // Soluciones y líquidos
  { id: 13, nombre: "Frasco 2.5 L", descripcion: "sin tapa | con tapa", categoria: "soluciones", disponible: true, etiqueta: "2.5L", precio: null, stock: 0, imagenUrl: null },
  { id: 14, nombre: "Solución salina 500 ml", descripcion: "500 ml", categoria: "soluciones", disponible: true, etiqueta: "500ml", precio: null, stock: 0, imagenUrl: null },
  { id: 15, nombre: "Solución salina 1.000 ml", descripcion: "1.000 ml", categoria: "soluciones", disponible: true, etiqueta: "1L", precio: null, stock: 0, imagenUrl: null },
  { id: 16, nombre: "Lactato de Ringer 500 ml", descripcion: "500 ml", categoria: "soluciones", disponible: true, etiqueta: "500ml", precio: null, stock: 0, imagenUrl: null },

  // Insumos médicos
  { id: 17, nombre: "Microbrush", descripcion: "x100 unidades", categoria: "insumos", disponible: true, etiqueta: "x100", precio: null, stock: 0, imagenUrl: null },
  { id: 18, nombre: "Jeringas 3 ml", descripcion: "caja x100", categoria: "insumos", disponible: true, etiqueta: "3ml", precio: null, stock: 0, imagenUrl: null },
  { id: 19, nombre: "Jeringas 5 ml", descripcion: "caja x100", categoria: "insumos", disponible: true, etiqueta: "5ml", precio: null, stock: 0, imagenUrl: null },
  { id: 20, nombre: "Jeringas 10 ml", descripcion: "caja x100", categoria: "insumos", disponible: true, etiqueta: "10ml", precio: null, stock: 0, imagenUrl: null },
  { id: 21, nombre: "Jeringas 20 ml", descripcion: "caja x50", categoria: "insumos", disponible: true, etiqueta: "20ml", precio: null, stock: 0, imagenUrl: null },
  { id: 22, nombre: "Agujas 30G x ½", descripcion: "caja completa", categoria: "insumos", disponible: true, etiqueta: "30G", precio: null, stock: 0, imagenUrl: null },
  { id: 23, nombre: "Yelcos #22", descripcion: "caja x50", categoria: "insumos", disponible: true, etiqueta: "#22", precio: null, stock: 0, imagenUrl: null },
  { id: 24, nombre: "Tubos para plasma", descripcion: "100 unid., tapa azul", categoria: "insumos", disponible: true, etiqueta: "x100", precio: null, stock: 0, imagenUrl: null },

  // Desinfectantes y químicos
  { id: 25, nombre: "Glutamida", descripcion: "galón 4.000 ml", categoria: "quimicos", disponible: true, etiqueta: "4L", precio: null, stock: 0, imagenUrl: null },
  { id: 26, nombre: "Benzaldina", descripcion: "galón 4.000 ml", categoria: "quimicos", disponible: true, etiqueta: "4L", precio: null, stock: 0, imagenUrl: null },

  // Ropa e indumentaria médica
  { id: 27, nombre: "Medias antiembólicas", descripcion: "par", categoria: "ropa", disponible: true, etiqueta: "PAR", precio: null, stock: 0, imagenUrl: null },
  { id: 28, nombre: "Bata cirujano manga larga", descripcion: "manga larga", categoria: "ropa", disponible: true, etiqueta: "CIRUJANO", precio: null, stock: 0, imagenUrl: null },
  { id: 29, nombre: "Bata paciente manga sisa", descripcion: "manga sisa", categoria: "ropa", disponible: true, etiqueta: "PACIENTE", precio: null, stock: 0, imagenUrl: null },
  { id: 30, nombre: "Polainas", descripcion: "50 pares", categoria: "ropa", disponible: true, etiqueta: "x50", precio: null, stock: 0, imagenUrl: null },
  { id: 31, nombre: "Gorros tipo oruga", descripcion: "100 unidades", categoria: "ropa", disponible: true, etiqueta: "x100", precio: null, stock: 0, imagenUrl: null },
  { id: 32, nombre: "Sábana desechable para camilla", descripcion: "para camilla", categoria: "ropa", disponible: true, etiqueta: "DESECHABLE", precio: null, stock: 0, imagenUrl: null },

  // Protección personal
  { id: 33, nombre: "Tapabocas empaque individual", descripcion: "empaque x50", categoria: "proteccion", disponible: true, etiqueta: "x50", precio: null, stock: 0, imagenUrl: null },
  { id: 34, nombre: "Guantes de nitrilo", descripcion: "caja x50 pares", categoria: "proteccion", disponible: true, etiqueta: "NITRILO", precio: null, stock: 0, imagenUrl: null },
  { id: 35, nombre: "Guantes estériles", descripcion: "caja x50 pares", categoria: "proteccion", disponible: true, etiqueta: "ESTÉRIL", precio: null, stock: 0, imagenUrl: null },
  { id: 36, nombre: "Guantes de látex", descripcion: "caja completa", categoria: "proteccion", disponible: true, etiqueta: "LÁTEX", precio: null, stock: 0, imagenUrl: null },
  { id: 37, nombre: "Campo estéril 1x1", descripcion: "1x1 metro", categoria: "proteccion", disponible: true, etiqueta: "1x1", precio: null, stock: 0, imagenUrl: null },
];

// helper para obtener el siguiente id
const obtenerSiguienteId = () =>
  productosBase.reduce((maxId, producto) => Math.max(maxId, producto.id), 0) + 1;

// utilidad para agregar productos
export const agregarProducto = (producto: Omit<Producto, "id">): Producto => {
  const nuevoProducto: Producto = { id: obtenerSiguienteId(), ...producto };
  productosBase.push(nuevoProducto);
  return nuevoProducto;
};
