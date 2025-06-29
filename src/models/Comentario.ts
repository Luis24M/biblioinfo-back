// models/Comentario.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IComentario extends Document {
  id_sugerencia: Types.ObjectId;
  cantidad_estrellas_comentario: number;
  fecha_comentario: Date;
  contenido_comentario: string;
  id_persona: Types.ObjectId;
  estado_comentario: boolean;
  reportado: Types.ObjectId[];
}

const ComentarioSchema = new Schema<IComentario>({
  id_sugerencia: { type: Schema.Types.ObjectId, ref: 'Sugerencia', required: true },
  cantidad_estrellas_comentario: { type: Number, min: 1, max: 5 },
  fecha_comentario: { type: Date, default: Date.now },
  contenido_comentario: { type: String, required: true },
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: true },
  estado_comentario: { type: Boolean, default: true },
  reportado: [{ type: Schema.Types.ObjectId, ref: 'ReporteComentario' }]
});

// indexes
ComentarioSchema.index({ id_sugerencia: 1, id_persona: 1 },
  { unique: true, name: 'unique_sugerencia_persona' }
);

export const Comentario = model<IComentario>('Comentario', ComentarioSchema);
