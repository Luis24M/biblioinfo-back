// models/Comentario.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IComentario extends Document {
  cantidad_estrellas_comentario: number;
  fecha_comentario: Date;
  id_libro: Types.ObjectId;
  contenido_comentario: string;
  id_persona: Types.ObjectId;
  estado_comentario: boolean;
  reportado: Types.ObjectId[];
}

const ComentarioSchema = new Schema<IComentario>({
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: true },
  id_libro: { type: Schema.Types.ObjectId, ref: 'Libro', required: true },
  cantidad_estrellas_comentario: { type: Number, min: 1, max: 5 },
  contenido_comentario: { type: String, required: true },
  fecha_comentario: { type: Date, default: Date.now },
  estado_comentario: { type: Boolean, default: true },
  reportado: [{ type: Schema.Types.ObjectId, ref: 'ReporteComentario' }]
});

// indexes
ComentarioSchema.index({ id_libro: 1, id_persona: 1 },
  { unique: true, name: 'unique_libro_persona' }
);

export const Comentario = model<IComentario>('Comentario', ComentarioSchema);
