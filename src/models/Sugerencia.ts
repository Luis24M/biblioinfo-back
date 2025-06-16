// models/Sugerencia.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ISugerencia extends Document {
  id_libro: Types.ObjectId;
  id_persona: Types.ObjectId;
  comentario_inicial: string;
  estado_sugerencia: boolean;
  id_comentario: Types.ObjectId[];
  fecha_sugerencia: Date;
}

const SugerenciaSchema = new Schema<ISugerencia>({
  id_libro: { type: Schema.Types.ObjectId, ref: 'Libro', required: true },
  id_persona: { type: Schema.Types.ObjectId, ref: 'Persona'},
  comentario_inicial: { type: String },
  estado_sugerencia: { type: Boolean, default: true },
  id_comentario: [{ type: Schema.Types.ObjectId, ref: 'Comentario' }],
  fecha_sugerencia: { type: Date, default: Date.now }
});

export const Sugerencia = model<ISugerencia>('Sugerencia', SugerenciaSchema);
