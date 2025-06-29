// models/ReporteComentario.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IReporteComentario extends Document {
  id_comentario: Types.ObjectId;
  id_persona: Types.ObjectId;
  motivo_reporte: string;
  fecha_reporte: Date;
  estado_reporte: boolean;
}

const ReporteComentarioSchema = new Schema<IReporteComentario>({
  id_comentario: { type: Schema.Types.ObjectId, ref: 'Comentario', required: true },
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona', required: true },
  motivo_reporte: { type: String, required: true },
  fecha_reporte: { type: Date, default: Date.now },
  estado_reporte: { type: Boolean, default: true }
});

// indexes
ReporteComentarioSchema.index({ id_comentario: 1, id_persona: 1 },
  { unique: true, name: 'unique_comentario_persona' }
);

export const ReporteComentario = model<IReporteComentario>('ReporteComentario', ReporteComentarioSchema);
