import { Schema, model, Document, Types } from 'mongoose';

export interface ILibro extends Document {
  _id: Types.ObjectId; // ✅ Añadir esto
  titulo: string;
  autor: string;
  categoria: string;
  anio: number;
  issbn: string;
  sinopsis: string;
  imagen_portada?: string;
  ruta_libro?: string;
  estado_libro: boolean;
  estado_revision: 'pendiente' | 'aprobado' | 'rechazado'; // NUEVO
  fecha_libro: Date;
  comentarios: Types.ObjectId[];
  estrellas: number;
  id_persona: Types.ObjectId;
}

const LibroSchema = new Schema<ILibro>({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  categoria: { type: String },
  anio: { type: Number },
  issbn: { type: String },
  sinopsis: { type: String },
  imagen_portada: { type: String },
  ruta_libro: { type: String },
  estado_libro: { type: Boolean, default: true },
  estado_revision: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  },
  fecha_libro: { type: Date, default: Date.now },
  comentarios: [{ type: Schema.Types.ObjectId, ref: 'Comentario' }],
  estrellas: { type: Number, default: 0 },
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona' }
});

// indexes
LibroSchema.index(
  { titulo: 1, autor: 1, categoria: 1 },
  { unique: true, name: 'unique_titulo_autor_categoria' }
);

export const Libro = model<ILibro>('Libro', LibroSchema);
